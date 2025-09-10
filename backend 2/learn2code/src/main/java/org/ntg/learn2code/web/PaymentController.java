package org.ntg.learn2code.web;

import lombok.RequiredArgsConstructor;
import org.ntg.learn2code.model.Course;
import org.ntg.learn2code.model.Payment;
import org.ntg.learn2code.model.User;
import org.ntg.learn2code.model.UserCourse;
import org.ntg.learn2code.model.StudentProfile;
import org.ntg.learn2code.repository.CourseRepository;
import org.ntg.learn2code.repository.PaymentRepository;
import org.ntg.learn2code.repository.UserCourseRepository;
import org.ntg.learn2code.repository.UserRepository;
import org.ntg.learn2code.repository.StudentProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(
        origins = { "http://localhost:3000" },
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS },
        allowedHeaders = { "Content-Type", "X-User-Id", "Authorization" },
        exposedHeaders = { "Location" }
)
public class PaymentController {

  private final PaymentRepository payments;
  private final UserCourseRepository userCourses;
  private final CourseRepository courses;
  private final UserRepository users;
  private final StudentProfileRepository studentProfiles;

  // ---------- DTOs ----------
  public record CheckoutRequest(
          List<Long> courseIds,
          BigDecimal amount,
          BigDecimal taxAmount,
          BigDecimal totalAmount,
          String currency,
          String method,
          String provider,
          String providerTxnId, // idempotency
          String status,
          String cardBrand,
          String cardLast4,
          String billingName,
          String billingEmail,
          Map<String, Object> billingAddress,
          Long studentId // assign purchase to a specific student (optional)
  ) {}

  public record CheckoutResponse(Long paymentId, String receiptNumber) {}

  // ---------- helpers ----------
  private static final SecureRandom RNG = new SecureRandom();

  private String newReceiptNumber() {
    String ts = java.time.LocalDate.now().toString().replace("-", "");
    String rnd = Long.toString(Math.abs(RNG.nextLong()), 36).toUpperCase();
    return "LC-" + ts + "-" + rnd.substring(0, 6);
  }

  // ---------- NEW: GET /api/payments (list all) ----------
  @GetMapping
  public ResponseEntity<?> listAllPayments() {
    return ResponseEntity.ok(payments.findAll());
  }

  // ---------- NEW: GET /api/payments/{id} (by id) ----------
  @GetMapping("/{id}")
  public ResponseEntity<?> getPayment(@PathVariable Long id) {
    return payments.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
  }

  // ---------- POST /api/payments/checkout ----------
  @PostMapping("/checkout")
  @Transactional
  public ResponseEntity<?> checkout(@RequestHeader("X-User-Id") Long userId,
                                    @RequestBody CheckoutRequest req) {

    if (req == null || req.courseIds() == null || req.courseIds().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "No courses provided"));
    }

    Optional<User> userOpt = users.findById(userId);
    if (userOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid user"));
    }
    User user = userOpt.get();

    // Resolve optional student and ensure it belongs to the parent
    StudentProfile student = null;
    if (req.studentId() != null) {
      Optional<StudentProfile> sOpt = studentProfiles.findById(req.studentId());
      if (sOpt.isEmpty() || !Objects.equals(sOpt.get().getParentUser().getId(), user.getId())) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid student selected"));
      }
      student = sOpt.get();
    }

    // --- Idempotency check ---
    if (req.provider() != null && req.providerTxnId() != null) {
      Optional<Payment> existingOpt = payments.findByUserIdAndProviderAndProviderTxnId(
              user.getId(), req.provider(), req.providerTxnId()
      );
      if (existingOpt.isPresent()) {
        Payment existingPayment = existingOpt.get();

        // Ensure user-course enrollment (scoped to student if provided)
        for (Long courseId : req.courseIds()) {
          if (courseId == null) continue;

          boolean already = (student != null)
                  ? userCourses.existsByUserIdAndCourseIdAndStudentId(user.getId(), courseId, student.getId())
                  : userCourses.existsByUserIdAndCourseId(user.getId(), courseId);

          if (!already) {
            Optional<Course> cOpt = courses.findById(courseId);
            if (cOpt.isPresent()) {
              Course c = cOpt.get();
              UserCourse uc = new UserCourse();
              uc.setUser(user);
              uc.setCourse(c);
              uc.setPayment(existingPayment);
              uc.setStudent(student); // keep consistent
              userCourses.save(uc);
            }
          }
        }
        return ResponseEntity.ok(new CheckoutResponse(existingPayment.getId(), existingPayment.getReceiptNumber()));
      }
    }

    // Defaults and safety
    BigDecimal amount     = Optional.ofNullable(req.amount()).orElse(BigDecimal.ZERO);
    BigDecimal taxAmount  = Optional.ofNullable(req.taxAmount()).orElse(BigDecimal.ZERO);
    BigDecimal total      = Optional.ofNullable(req.totalAmount()).orElse(amount.add(taxAmount));
    String currency       = Optional.ofNullable(req.currency()).orElse("USD");
    String status         = Optional.ofNullable(req.status()).orElse("completed");

    Payment p = new Payment();
    p.setUser(user);
    p.setStudent(student); // tie the payment to the student (nullable)
    p.setAmount(amount);
    p.setTaxAmount(taxAmount);
    p.setTotalAmount(total);
    p.setCurrency(currency);
    p.setMethod(req.method());
    p.setProvider(req.provider());
    p.setProviderTxnId(req.providerTxnId());
    p.setStatus(status);
    p.setCardBrand(req.cardBrand());
    p.setCardLast4(req.cardLast4());
    p.setBillingName(req.billingName());
    p.setBillingEmail(req.billingEmail());
    p.setBillingAddress(req.billingAddress());
    p.setCreatedAt(Instant.now());

    // Generate unique receiptNumber with retry
    int attempts = 0;
    boolean saved = false;
    while (!saved) {
      try {
        p.setReceiptNumber(newReceiptNumber());
        p = payments.save(p);
        saved = true;
      } catch (DataIntegrityViolationException ex) {
        attempts++;
        if (attempts >= 3) throw ex;
      }
    }

    // Enroll user in each purchased course (scoped to student if provided)
    for (Long courseId : req.courseIds()) {
      if (courseId == null) continue;

      boolean already = (student != null)
              ? userCourses.existsByUserIdAndCourseIdAndStudentId(user.getId(), courseId, student.getId())
              : userCourses.existsByUserIdAndCourseId(user.getId(), courseId);

      if (!already) {
        Optional<Course> cOpt = courses.findById(courseId);
        if (cOpt.isPresent()) {
          Course c = cOpt.get();
          UserCourse uc = new UserCourse();
          uc.setUser(user);
          uc.setCourse(c);
          uc.setPayment(p);
          uc.setStudent(student);
          userCourses.save(uc);
        }
      }
    }

    return ResponseEntity.ok(new CheckoutResponse(p.getId(), p.getReceiptNumber()));
  }

  // ---------- GET /api/payments/user/{userId} ----------
  @GetMapping("/user/{userId}")
  public ResponseEntity<?> listUserPayments(@PathVariable Long userId) {
    if (userId == null || users.findById(userId).isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid user"));
    }
    return ResponseEntity.ok(payments.findByUserIdOrderByCreatedAtDesc(userId));
  }
}
