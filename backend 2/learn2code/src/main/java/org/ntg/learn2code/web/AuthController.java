package org.ntg.learn2code.web;

import java.util.Map;
import java.util.UUID;

import org.ntg.learn2code.model.User;
import org.ntg.learn2code.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "https://fri-latter-capture-pvc.trycloudflare.com"   // <— your frontend tunnel
        },
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS },
        allowedHeaders = { "Content-Type", "Authorization", "X-Requested-With" },
        allowCredentials = "false"
)
public class AuthController {

  private final UserRepository users;
  private final PasswordEncoder encoder = new BCryptPasswordEncoder();

  public AuthController(UserRepository users) {
    this.users = users;
  }

  public record RegisterRequest(String name, String email, String password, String role) {}
  public record LoginRequest(String email, String password) {}
  public record LoginResponse(String token, Map<String,Object> user) {}

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    if (req == null || isBlank(req.name()) || isBlank(req.email()) || isBlank(req.password())) {
      return ResponseEntity.badRequest().body(Map.of("message", "invalid_input"));
    }
    if (users.existsByEmailIgnoreCase(req.email())) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "email_in_use"));
    }
    User u = new User();
    u.setName(req.name().trim());
    u.setEmail(req.email().trim().toLowerCase());
    u.setPasswordHash(encoder.encode(req.password()));
    u.setRole(isBlank(req.role()) ? "PARENT" : req.role().trim().toUpperCase());
    users.save(u);
    return ResponseEntity.ok(Map.of("message", "registered", "id", u.getId()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    if (req == null || isBlank(req.email()) || isBlank(req.password())) {
      return ResponseEntity.badRequest().body(Map.of("message", "invalid_input"));
    }
    var u = users.findByEmailIgnoreCase(req.email().trim().toLowerCase()).orElse(null);
    if (u == null || !encoder.matches(req.password(), u.getPasswordHash())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "invalid_credentials"));
    }
    String token = UUID.randomUUID().toString();
    Map<String, Object> user = Map.of(
            "id", u.getId(),
            "name", u.getName(),
            "email", u.getEmail(),
            "role", u.getRole()
    );
    return ResponseEntity.ok(new LoginResponse(token, user));
  }

  private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
}
