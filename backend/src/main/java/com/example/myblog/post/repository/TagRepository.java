package com.example.myblog.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.myblog.post.entity.Tag;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag,Long>{
    /**
     * 태그 이름(tagName)으로 태그를 조회합니다.
     * 결과가 없을 수도 있으므로 Optional<Tag> 타입으로 반환합니다.
     * @param tagName 조회할 태그의 이름
     * @return Optional<Tag>
     */
    Optional<Tag> findByTagName(String tagName);
}