// src/main/java/org/ntg/learn2code/model/Payment.java
package org.ntg.learn2code.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "payments")
public class Payment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false) @JoinColumn(name = "user_id")
  private User user;

  // NEW: optional student this payment was for
  @ManyToOne(optional = true) @JoinColumn(name = "student_id")
  private StudentProfile student;

  @Column(nullable = false, precision = 10, scale = 2) private BigDecimal amount;
  @Column(nullable = false, length = 3) private String currency = "USD";
  @Column(precision = 10, scale = 2) private BigDecimal taxAmount = BigDecimal.ZERO;
  @Column(nullable = false, precision = 10, scale = 2) private BigDecimal totalAmount;

  private String method;
  private String provider;
  private String providerTxnId;
  private String status;

  @Column(unique = true) private String receiptNumber;
  private String cardBrand;
  private String cardLast4;
  private String billingName;
  private String billingEmail;

  @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
  private Map<String,Object> billingAddress;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();
}
