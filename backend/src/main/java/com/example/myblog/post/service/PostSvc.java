package com.example.myblog.post.service;

import com.example.myblog.common.dto.PageResponseDto;
import com.example.myblog.post.dto.PostRequestDto;
import com.example.myblog.post.dto.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostSvc {
    //게시글 생성
    public Long createPost(PostRequestDto requestDto, Long userId);

    // 게시글 수정
    Long updatePost(Long postId, PostRequestDto requestDto, Long userId);

    // 게시글 삭제 (논리적 삭제)
    void deletePost(Long postId, Long userId);

    // 게시글 목록 조회
    PageResponseDto<PostResponseDto> getPostList(Pageable pageable);
}
