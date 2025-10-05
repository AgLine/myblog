package com.example.myblog.post.entity;

import com.example.myblog.auth.entity.User;

import com.example.myblog.common.entity.BaseTimeEntity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post", indexes = @Index(name = "idx_post_update_date", columnList = "updateDate"))
public class Post extends BaseTimeEntity {

    //글ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //작성자ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //글제목
    @Column(nullable = false, length = 200)
    private String title;

    //글내용: 마크다운문법적용되어있음
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    //글의 태그들 여러개일수있음
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "post_tag", // Post와 Tag를 연결해 줄 중간 테이블의 이름을 post_tag로 만듬
            joinColumns = @JoinColumn(name = "post_id"), // Post 테이블의 PK(postId)를 참조
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Tag 테이블의 PK(tagId)를 참조
    )
    private Set<Tag> tags = new HashSet<>();

    //게시글 상태값
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    //조회수
    @Column(nullable = false)
    @ColumnDefault("0")
    private int viewCount;
}
