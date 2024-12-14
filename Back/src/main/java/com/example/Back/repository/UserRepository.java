package com.example.Back.repository;

import com.example.Back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 可以根据需要添加自定义查询方法
    User findByEmail(String email);
}
