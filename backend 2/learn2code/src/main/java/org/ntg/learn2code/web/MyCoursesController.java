// src/main/java/org/ntg/learn2code/web/MyCoursesController.java
package org.ntg.learn2code.web;

import org.ntg.learn2code.dto.CourseDto;
import org.ntg.learn2code.model.Course;
import org.ntg.learn2code.repository.CourseRepository;
import org.ntg.learn2code.repository.UserCourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000"})
public class MyCoursesController {

    private final UserCourseRepository userCourses;
    private final CourseRepository courses;

    public MyCoursesController(UserCourseRepository userCourses, CourseRepository courses) {
        this.userCourses = userCourses;
        this.courses = courses;
    }

    @GetMapping("/courses")
    public List<CourseDto> listCourses() {
        List<Course> all = courses.findAll();
        List<CourseDto> out = new ArrayList<>(all.size());
        for (Course c : all) {
            out.add(new CourseDto(c.getId(), c.getTitle(), c.getDescription(), c.getPrice()));
        }
        return out;
    }

    // NEW: optional studentId query param
    // src/main/java/org/ntg/learn2code/web/MyCoursesController.java
    @GetMapping("/me/courses")
    public List<CourseDto> myCourses(@RequestHeader("X-User-Id") Long userId,
                                     @RequestParam(value = "studentId", required = false) Long studentId) {
        if (studentId != null) {
            return userCourses.findCourseDtosByUserIdAndStudentId(userId, studentId);
        }
        return userCourses.findCourseDtosByUserId(userId);
    }

}

