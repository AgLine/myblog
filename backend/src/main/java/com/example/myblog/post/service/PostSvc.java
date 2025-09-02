package com.example.myblog.post.service;

import com.example.myblog.post.dto.PostRequestDto;

public interface PostSvc {
    public Long createPost(PostRequestDto requestDto, Long userId);
}
