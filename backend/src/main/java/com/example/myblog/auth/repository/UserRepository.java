package com.example.myblog.auth.repository;

import com.example.myblog.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndProvider(String email, String provider);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserIdAndProvider(String userId, String provider);

}
