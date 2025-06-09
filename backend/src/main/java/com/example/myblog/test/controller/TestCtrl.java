package com.example.myblog.test.controller;

import com.example.myblog.test.dto.TestRequestDto;
import com.example.myblog.test.entity.TestEntity;
import com.example.myblog.test.repository.TestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class TestCtrl {
    @Autowired
    private TestRepository testRepository;

    @PostMapping
    public ResponseEntity<String> saveTestPost(@RequestBody TestRequestDto dto) {
        System.out.println("ㅎㅇ");
        TestEntity post = TestEntity.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .build();
        testRepository.save(post);
        return ResponseEntity.ok("저장 성공");
    }
}
