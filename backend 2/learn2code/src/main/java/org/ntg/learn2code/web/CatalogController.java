package org.ntg.learn2code.web;

import lombok.RequiredArgsConstructor;
import org.ntg.learn2code.repository.CourseRepository;
import org.ntg.learn2code.repository.UserCourseRepository;
import org.ntg.learn2code.model.Course;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000" })
public class CatalogController {

  private final CourseRepository courseRepo;
  private final UserCourseRepository userCourseRepo;

  // Public storefront
  @GetMapping(value="/courses", produces=MediaType.APPLICATION_JSON_VALUE)
  public List<Course> listAllActive(){
    return courseRepo.findByIsActiveTrue();
  }

  // My Courses (replace principal with header userId for simplicity)
  @GetMapping(value="/me/courses", produces=MediaType.APPLICATION_JSON_VALUE)
  public List<Course> myCourses(@RequestHeader("X-User-Id") Long userId){
    return userCourseRepo.findCoursesByUserId(userId);
  }
}
