package org.ntg.learn2code.repository;

import org.ntg.learn2code.model.Payment;
import org.ntg.learn2code.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    List<StudentProfile> findByParentUserIdOrderByCreatedAtDesc(Long parentUserId);
}
