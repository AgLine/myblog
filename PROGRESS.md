# 프로젝트 진행 상황

## 2025-08-24
- 현재까지 완료된사항 -> 로그인 회원가입 jwt토큰발급
- 마이페이지에 사용할 이름을 위한 user테이블에 userId 컬럼 추가


## 2025-08-25
<img width="595" height="265" alt="image" src="https://github.com/user-attachments/assets/ede0d57b-8a7b-425e-9e8f-11a10f2c46b4" />

- userId API 추가중 SecurityConfig 오류 발생 -> 이전에 겪었던 오류지만 또 발생
- API는 개발완료

## 2025-08-26
- userId API 테스트 완료
- react 글작성페이지 추가

## 2025-08-27
- 글작성 백엔드 개발중

## 2025-08-28
- entity 설계에 대해 고민
- post, tag
  
## 2025-08-31
- post entity 작성중

## 2025-09-01
- post entity 작성완료
- 프론트의 요청이 백으로 가지않는 문제점이 발생했는데 Spring Security의 문제인줄알고 삽질을 너무많이했다
- @PostMapping("/post/createPost") 백과 프론트의 URL 불일치의 문제를 찾는데 오래걸렸다

## 2025-09-02
- 글작성 백엔드 기본골격 완성

## 2025-09-09
- 글작성 CRUD 백엔드 API 완료
- 기능테스트는 미완료

## 2025-09-11
- Read -> 단건조회기능 추가
  
## 2025-09-13
- 리액트 조회페이지 수정
- 태그, 수정|삭제 버튼, 작성자이름, 작성일자가 리액트페이지에서 보이지않았다
- 백엔드API와 리액트페이지에서의 이름이 맞지않아서 발생한 문제였다
- Read 테스트완료

## 2025-09-15
- SpringSecurity requestMatchers HttpMethod.DELETE 추가
- Delete 테스트완료

## 2025-09-16
- 글목록 API 수정 -> status가 PUBLISHED 인거만 조회
- 임시저장기능 추가

## 2025-09-26
- 글 수정 리액트 페이지 개발

## 2025-09-27
- 글 수정 기능 테스트

## 2025-09-28
- write.jsx 수정,생성후 navigate 경로 수정
