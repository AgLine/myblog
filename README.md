# 📝 브런치 스타일 블로그 플랫폼 클론 (진행중)
---
## 📌 프로젝트 개요
- **기간**: 2025.07 ~ 진행중
- **Backend**: `Java17`, `Spring Boot 3`, `Spring Security`, `JWT`, `JPA`
- **Frontend**: `Raect`
- **Build Tool**: `gradle`
- **DB**: `PostgreSQL`
- **Cache**: `Redis`
- **IDE**: `IntelliJ`, `DBeaver`, `Docker Desktop`

---
## 🎯 프로젝트 목적
브런치(Brunch) 플랫폼을 벤치마킹하여, Markdown 기반의 글쓰기 기능을 제공하는 블로그 서비스를 구현하는 것을 목표로 합니다.

특히 대용량 트래픽과 데이터를 효과적으로 처리하기 위해 PostgreSQL 인덱싱 전략을 적용하여 쿼리 성능을 최적화하고, Redis 캐싱을 통해 응답 속도를 향상시키는 경험을 쌓고자 합니다. 
또한, JWT 인증, 소셜 로그인, CI/CD 자동 배포까지 구현하여 실무와 유사한 서비스 환경을 구축하는 것을 목표로 합니다.

---
## 🛠 주요 기능
### 1. 인증/인가 시스템 (완료)
- JWT 기반 로그인/회원가입
- Google OAuth2 소셜 로그인

### 2. 게시글 (완료)
- 게시글 CRUD (Markdown 지원)

### 3. 성능 최적화 (진행중)
- 대용량 데이터 처리 및 인덱싱: 50만 건 이상의 게시글 데이터를 가정하여, PostgreSQL 인덱싱 전략을 통해 검색 및 조회 성능 최적화 (완료)
- Redis 캐싱 적용: 인기글, 자주 조회되는 게시글 데이터를 Redis에 캐싱하여 DB 부하를 줄이고 응답 시간 단축

### 4. 배포 자동화 (진행 중)
- Spring Boot, React Docker 이미지 빌드 (완료)
- GitHub Actions + Jenkins CI/CD (학습중)
- Kubernetes 클러스터에 배포 (예정)
---
## 📖 배운 점 & 느낀 점


---
## 📷 실행 화면
### 회원가입
![회원가입](https://github.com/user-attachments/assets/95d7e134-1ed6-4c08-a9d1-5b921cff9f57)

### 로그인
![로그인](https://github.com/user-attachments/assets/f35a6d52-d1ca-45c7-ba91-7aa9ba3b4702)

### 구글로그인
![구글로그인](https://github.com/user-attachments/assets/df37215e-dcc7-458e-89a4-b38c627559d1)

### 메인화면
<img width="1534" height="864" alt="image" src="https://github.com/user-attachments/assets/2a838be1-0ff7-4081-8cff-8fbd93d8c52e" />
