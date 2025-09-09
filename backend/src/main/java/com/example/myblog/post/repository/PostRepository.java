package com.example.myblog.post.repository;

import com.example.myblog.post.entity.Post;
import com.example.myblog.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {
    /**
     * N+1 문제 해결을 위해 `JOIN FETCH` 사용
     * 삭제되지 않은 모든 게시글을 페이지네이션과 함께 조회합니다.
     */
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.user WHERE p.status <> :status",
            countQuery = "SELECT count(p) FROM Post p WHERE p.status <> :status")
    Page<Post> findAllByStatusNot(@Param("status") PostStatus status, Pageable pageable);
}
