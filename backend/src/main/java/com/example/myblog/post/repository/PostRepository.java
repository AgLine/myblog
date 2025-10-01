package com.example.myblog.post.repository;

import com.example.myblog.post.entity.Post;
import com.example.myblog.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    /**
     * N+1 문제 해결을 위해 `JOIN FETCH` 사용
     * 삭제되지 않은 모든 게시글을 페이지네이션과 함께 조회합니다.
     */
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.user WHERE p.status = :status",
            countQuery = "SELECT count(p) FROM Post p WHERE p.status = :status")
    Page<Post> findAllByStatus(@Param("status") PostStatus status, Pageable pageable);

    /**
     * ✅ 게시글 상세 조회 (N+1 문제 해결을 위해 User, Tags 정보 JOIN FETCH)
     * ID로 게시글을 조회할 때, 연관된 User와 Tags 정보까지 한 번의 쿼리로 가져옵니다.
     */
    @Query("SELECT p FROM Post p JOIN FETCH p.user LEFT JOIN FETCH p.tags WHERE p.id = :id")
    Optional<Post> findByIdWithUserAndTags(@Param("id") Long id);

    /**
     * redis를 위한 게시글 조회수 증가 쿼리
     */
    @Modifying
    @Query("update Post p set p.viewCount = p.viewCount + 1 where p.id = :id")
    int increaseViewCount(@Param("id") Long id);
}
