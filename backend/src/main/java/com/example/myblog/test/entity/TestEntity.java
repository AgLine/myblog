package com.example.myblog.test.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
}