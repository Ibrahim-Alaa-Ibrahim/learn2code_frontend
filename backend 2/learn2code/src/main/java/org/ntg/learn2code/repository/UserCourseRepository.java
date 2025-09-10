// src/main/java/org/ntg/learn2code/repository/UserCourseRepository.java
package org.ntg.learn2code.repository;

import org.ntg.learn2code.model.UserCourse;
import org.ntg.learn2code.model.Course;
import org.ntg.learn2code.dto.CourseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

// src/main/java/org/ntg/learn2code/repository/UserCourseRepository.java
public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {

  @Query("select uc.course from UserCourse uc where uc.user.id = :userId")
  List<Course> findCoursesByUserId(@Param("userId") Long userId);

  List<UserCourse> findByUserId(Long userId);

  @Query("""
         select new org.ntg.learn2code.dto.CourseDto(c.id, c.title, c.description, c.price)
         from UserCourse uc join uc.course c
         where uc.user.id = :userId
         """)
  List<CourseDto> findCourseDtosByUserId(@Param("userId") Long userId);

  // NEW: filter by student
  @Query("""
         select new org.ntg.learn2code.dto.CourseDto(c.id, c.title, c.description, c.price)
         from UserCourse uc join uc.course c
         where uc.user.id = :userId and uc.student.id = :studentId
         """)
  List<CourseDto> findCourseDtosByUserIdAndStudentId(@Param("userId") Long userId,
                                                     @Param("studentId") Long studentId);

  boolean existsByUserIdAndCourseId(Long userId, Long courseId);

  // NEW: idempotency per student
  boolean existsByUserIdAndCourseIdAndStudentId(Long userId, Long courseId, Long studentId);

  // NEW: for per-student counts
  long countByStudentId(Long studentId);
}
