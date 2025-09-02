package com.example.myblog.post.service.impl;

import com.example.myblog.post.entity.Post;
import com.example.myblog.post.entity.Tag;
import com.example.myblog.auth.entity.User;
import com.example.myblog.auth.repository.UserRepository;
import com.example.myblog.post.repository.TagRepository;
import com.example.myblog.post.repository.PostRepository;
import com.example.myblog.post.dto.PostRequestDto;
import com.example.myblog.post.service.PostSvc;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostSvcImpl implements PostSvc {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Override
    public Long createPost(PostRequestDto requestDto, Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. id=" + userId));

            // DTO의 태그 이름 리스트를 Tag 엔티티 Set으로 변환
            Set<Tag> tags = new HashSet<>();
            if (requestDto.getTags() != null) {
                tags = requestDto.getTags().stream()
                        .map(this::findOrCreateTag)
                        .collect(Collectors.toSet());
            }

            Post post = new Post();

            post.setUser(user);
            post.setTitle(requestDto.getTitle());
            post.setContent(requestDto.getContent());
            post.setStatus(requestDto.getStatus());
            post.setTags(tags);

            Post savedPost = postRepository.save(post);

            // 성공 시: 저장된 게시글의 ID를 반환
            return savedPost.getId();

        } catch (Exception e) {
            // 실패 시: 에러 로그를 찍고 null을 반환
            // log.error("게시글 저장 실패", e);
            return null;
        }
    }

    // 태그 이름으로 태그를 찾거나, 없으면 새로 생성하는 헬퍼 메서드
    private Tag findOrCreateTag(String tagName) {
        return tagRepository.findByTagName(tagName)
                .orElseGet(() -> tagRepository.save(new Tag(null, tagName)));
    }
}