package com.example.myblog.post.service.impl;

import com.example.myblog.auth.entity.User;
import com.example.myblog.auth.repository.UserRepository;
import com.example.myblog.common.dto.PageResponseDto;
import com.example.myblog.post.dto.PostResponseDto;
import com.example.myblog.post.dto.PostRequestDto;
import com.example.myblog.post.entity.Post;
import com.example.myblog.post.entity.PostStatus;
import com.example.myblog.post.entity.Tag;
import com.example.myblog.post.repository.PostRepository;
import com.example.myblog.post.repository.TagRepository;
import com.example.myblog.post.service.PostSvc;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
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

    @Override
    @Transactional
    public Long updatePost(Long postId, PostRequestDto requestDto, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다. id=" + postId));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("게시글을 수정할 권한이 없습니다.");
        }

        Set<Tag> tags = requestDto.getTags().stream()
                .map(this::findOrCreateTag)
                .collect(Collectors.toSet());

        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setStatus(requestDto.getStatus());
        post.getTags().clear();
        post.getTags().addAll(tags);

        return post.getId();
    }

    @Override
    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다. id=" + postId));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("게시글을 삭제할 권한이 없습니다.");
        }

        post.setStatus(PostStatus.DELETE);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<PostResponseDto> getPostList(Pageable pageable) {
        Page<Post> postPage = postRepository.findAllByStatus(PostStatus.PUBLISHED, pageable);

        // Page<Post>를 Page<PostListResponseDto>로 변환
        Page<PostResponseDto> postListDtoPage = postPage.map(PostResponseDto::new);

        // 최종적으로 Page<PostListResponseDto>를 PageResponseDto로 감싸서 반환
        return new PageResponseDto<>(postListDtoPage);
    }

    @Override
    @Transactional(readOnly = true) // 데이터 변경이 없는 조회 기능이므로 readOnly = true로 성능 최적화
    public PostResponseDto getPost(Long postId) {
        // 1. Repository를 통해 게시글 정보를 한 번에 조회합니다.
        Post post = postRepository.findByIdWithUserAndTags(postId)
                .orElseThrow(() -> new EntityNotFoundException("해당 게시글을 찾을 수 없습니다. id=" + postId));

        // 2. 삭제된 게시글인지 확인합니다. (삭제된 글은 보여주지 않음)
        if (post.getStatus() == PostStatus.DELETE) {
            throw new IllegalArgumentException("삭제된 게시글입니다.");
        }

        // 3. 조회된 Post 엔티티를 PostResponseDto로 변환하여 반환합니다.
        return new PostResponseDto(post);
    }

    // 태그 이름으로 태그를 찾거나, 없으면 새로 생성하는 헬퍼 메서드
    private Tag findOrCreateTag(String tagName) {
        return tagRepository.findByTagName(tagName)
                .orElseGet(() -> tagRepository.save(new Tag(null, tagName)));
    }

    @Override
    @Transactional
    public void increaseViewCount(Long postId) {
        postRepository.increaseViewCount(postId);
    }

    @Override
    public List<PostResponseDto> findTop5Posts() {
        List<Post> posts = postRepository.findTop5ByOrderByViewCountDesc();

        return posts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }
}