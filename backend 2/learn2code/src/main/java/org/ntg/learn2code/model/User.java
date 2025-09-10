package org.ntg.learn2code.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false, length=200) private String name;
  @Column(nullable=false, length=200, unique = true) private String email;
  @Column(name = "password_hash", nullable=false, length=200) private String passwordHash;
  @Column(nullable=false, length=50) private String role = "PARENT";
  // phone optional
  private String phone;

  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getName(){return name;}
  public void setName(String n){this.name=n;}
  public String getEmail(){return email;}
  public void setEmail(String e){this.email=e;}
  public String getPasswordHash(){return passwordHash;}
  public void setPasswordHash(String p){this.passwordHash=p;}
  public String getRole(){return role;}
  public void setRole(String r){this.role=r;}
  public String getPhone(){return phone;}
  public void setPhone(String p){this.phone=p;}
}
