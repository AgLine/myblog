package com.example.myblog.post.dto;

import com.example.myblog.post.entity.Post;
import com.example.myblog.post.entity.PostStatus;
import com.example.myblog.post.entity.Tag;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostResponseDto {
    private final String title;
    private final String content;
    private final List<String> tags;
    private final PostStatus status;
    private final String userNickname; // 작성자 닉네임
    private final String updatedAt;    // 최종 수정일

    // Post 엔티티를 받아서 DTO로 변환해주는 생성자
    public PostResponseDto(Post post) {
        this.title = post.getTitle();
        this.content = post.getContent();
        // Set<Tag>를 List<String>으로 변환
        this.tags = post.getTags().stream()
                .map(Tag::getTagName)
                .collect(Collectors.toList());
        this.status = post.getStatus();
        // 연관된 User 객체의 닉네임 사용
        this.userNickname = post.getUser().getUserId();
        // 날짜 형식을 프론트엔드에서 사용하기 쉽게 변환
        this.updatedAt = post.getUpdateDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }

}
