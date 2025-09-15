package com.example.myblog.post.controller;

import com.example.myblog.common.dto.PageResponseDto;
import com.example.myblog.post.dto.PostRequestDto;
import com.example.myblog.auth.entity.User;
import com.example.myblog.post.dto.PostResponseDto;
import com.example.myblog.post.service.PostSvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    /**
     * 게시글 목록 조회 API
     */
    @GetMapping("/posts")
    public ResponseEntity<PageResponseDto<PostResponseDto>> getPostList(
            @PageableDefault(size = 10, sort = "updateDate", direction = Sort.Direction.DESC) Pageable pageable) {

        // 반환 타입이 PageResponseDto로 자연스럽게 변경됩니다.
        PageResponseDto<PostResponseDto> postList = postSvc.getPostList(pageable);
        return ResponseEntity.ok(postList);
    }

    /**
     * 게시글 단건조회 API
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postSvc.getPost(postId));
    }

    /**
     * 게시글 수정 API
     */
    @PutMapping("/post/{postId}")
    public ResponseEntity<Map<String, String>> updatePost(@PathVariable Long postId, @RequestBody PostRequestDto requestDto, @AuthenticationPrincipal User user) {
        Long updatedPostId = postSvc.updatePost(postId, requestDto, user.getId());
        Map<String, String> response = Map.of("status", "success", "postId", String.valueOf(updatedPostId));
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 삭제 API
     */
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long postId, @AuthenticationPrincipal User user) {
        System.out.println("삭제삭제삭제");
        postSvc.deletePost(postId, user.getId());
        Map<String, String> response = Map.of("status", "success", "message", "게시글이 성공적으로 삭제되었습니다.");
        return ResponseEntity.ok(response);
    }

}
