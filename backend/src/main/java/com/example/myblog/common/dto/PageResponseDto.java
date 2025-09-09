package com.example.myblog.common.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponseDto<T> {

    private final List<T> content;          // 데이터 목록
    private final int pageNumber;         // 현재 페이지 번호
    private final int pageSize;           // 페이지 당 데이터 수
    private final long totalElements;     // 전체 데이터 수
    private final int totalPages;         // 전체 페이지 수
    private final boolean last;             // 마지막 페이지 여부

    // Page 객체를 DTO로 변환하는 생성자
    public PageResponseDto(Page<T> page) {
        this.content = page.getContent();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.last = page.isLast();
    }
}
