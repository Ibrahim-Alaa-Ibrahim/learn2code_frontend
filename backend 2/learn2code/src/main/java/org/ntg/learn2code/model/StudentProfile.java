package org.ntg.learn2code.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="parent_user_id")
    private User parentUser;

    private String name;
    private Integer age;
    @Column(name="avatar_url")
    private String avatarUrl;
    @Column(name="created_at")
    private Instant createdAt = Instant.now();
}

