package com.example.myblog.post.dto;

import com.example.myblog.post.entity.PostStatus;
import lombok.Data;
import java.util.List;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private List<String> tags; // 프론트에서는 태그 이름을 문자열 리스트로 받음
    private PostStatus status;
}
