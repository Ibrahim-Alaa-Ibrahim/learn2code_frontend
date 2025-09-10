package org.ntg.learn2code.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "courses")
public class Course {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  private String imageUrl;

  @Column(nullable = false)
  private boolean isActive = true;
}
