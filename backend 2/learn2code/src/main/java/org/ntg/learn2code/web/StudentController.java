// src/main/java/org/ntg/learn2code/web/StudentController.java
package org.ntg.learn2code.web;

import lombok.RequiredArgsConstructor;
import org.ntg.learn2code.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.ntg.learn2code.model.StudentProfile;
import org.ntg.learn2code.repository.StudentProfileRepository;
import org.ntg.learn2code.repository.UserCourseRepository;

import java.util.ArrayList;
import java.util.List;

// src/main/java/org/ntg/learn2code/web/StudentController.java
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/parents")
@CrossOrigin(origins = {"http://localhost:3000"})
public class StudentController {
    private final UserRepository users;
    private final StudentProfileRepository students;
    private final UserCourseRepository userCourses;

    public record StudentSummary(Long id, String name, Integer age, String avatarUrl, long coursesEnrolled) {}
    public record CreateStudentReq(String name, Integer age, String avatarUrl) {}

    @GetMapping("/me/students")
    public List<StudentProfile> myStudents(@RequestHeader("X-User-Id") Long parentId) {
        return students.findByParentUserIdOrderByCreatedAtDesc(parentId);
    }

    // NEW: with per-student course counts
    @GetMapping("/me/students/with-stats")
    public List<StudentSummary> myStudentsWithStats(@RequestHeader("X-User-Id") Long parentId) {
        return students.findByParentUserIdOrderByCreatedAtDesc(parentId)
                .stream()
                .map(s -> new StudentSummary(s.getId(), s.getName(), s.getAge(), s.getAvatarUrl(),
                        userCourses.countByStudentId(s.getId())))
                .toList();
    }

    @PostMapping("/me/students")
    public StudentProfile create(@RequestHeader("X-User-Id") Long parentId, @RequestBody CreateStudentReq req) {
        var parent = users.findById(parentId).orElseThrow();
        var s = new StudentProfile();
        s.setParentUser(parent);
        s.setName(req.name());
        s.setAge(req.age());
        s.setAvatarUrl(req.avatarUrl());
        return students.save(s);
    }
}
