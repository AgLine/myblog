package com.example.myblog.post.controller;

import com.example.myblog.post.dto.PostRequestDto;
import com.example.myblog.auth.entity.User;
import com.example.myblog.post.service.PostSvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Controller
public class PostCtrl {

    @Autowired
    private PostSvc postSvc;

    /**
     * 게시글 생성 API
     * @param requestDto 클라이언트로부터 받은 게시글 정보 (title, content, tags, status)
     * @param user JWT 토큰을 통해 인증된 사용자 정보
     * @return 생성된 게시글의 ID를 포함한 응답
     */
    @PostMapping("/post/createPost")
    public ResponseEntity<Map<String, String>> createPost(@RequestBody PostRequestDto requestDto, @AuthenticationPrincipal User user) {
        /*
        System.out.println("제목 : "+requestDto.getTitle());
        System.out.println("내용 : "+requestDto.getContent());
        System.out.println("태그 : "+requestDto.getTags());
        */

        Long userId = user.getId();
        Long postId = postSvc.createPost(requestDto, userId);

        // 👉 서비스 결과가 null이 아니면 (성공하면)
        if (postId != null) {
            Map<String, String> successResponse = Map.of("status", "success", "postId", String.valueOf(postId));
            // 200 OK 응답을 보냅니다. (201 Created도 가능)
            return ResponseEntity.ok(successResponse);
        }
        // 👉 서비스 결과가 null이면 (실패하면)
        else {
            Map<String, String> errorResponse = Map.of("status", "error", "message", "게시글 저장에 실패했습니다.");
            // 500 Internal Server Error 응답을 보냅니다.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
