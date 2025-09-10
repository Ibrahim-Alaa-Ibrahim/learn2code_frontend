package org.ntg.learn2code.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import org.ntg.learn2code.dto.CourseDto;


@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "user_courses", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","course_id"}))
public class UserCourse {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false) @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne(optional = false) @JoinColumn(name = "course_id")
  private Course course;

  @ManyToOne @JoinColumn(name = "payment_id")
  private Payment payment;

  @ManyToOne(optional=true) @JoinColumn(name="student_id")
  private StudentProfile student;

  @Column(nullable = false)
  private Instant purchasedAt = Instant.now();

  public CourseDto toDto() {
    return new CourseDto(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getPrice()
    );
  }
}
