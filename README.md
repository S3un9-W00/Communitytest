# 커뮤니티 사이트

로그인, 게시글, 댓글, 좋아요 기능이 있는 간단한 커뮤니티 웹사이트입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 언어 | TypeScript |
| 프레임워크 | Next.js 16 (App Router) |
| 스타일링 | Tailwind CSS |
| 데이터베이스 | SQLite |
| ORM | Prisma 5 |
| 인증 | NextAuth.js |

## 주요 기능

- 회원가입 / 로그인
- 게시글 작성, 수정, 삭제
- 댓글 작성, 삭제
- 좋아요 / 좋아요 취소
- 사용자 프로필 페이지

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="시크릿키를-여기에-입력"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인, 회원가입 페이지
│   ├── api/             # API 라우트
│   │   ├── auth/        # NextAuth.js 인증
│   │   ├── posts/       # 게시글 API
│   │   ├── comments/    # 댓글 API
│   │   ├── likes/       # 좋아요 API
│   │   └── users/       # 사용자 API
│   ├── posts/           # 게시글 페이지
│   └── profile/         # 프로필 페이지
├── components/          # React 컴포넌트
├── lib/                 # 유틸리티 (prisma, auth)
└── types/               # TypeScript 타입

prisma/
├── schema.prisma        # 데이터베이스 스키마
└── dev.db               # SQLite 데이터베이스 파일
```

## 데이터베이스 스키마

| 테이블 | 필드 |
|--------|------|
| User | id, email, name, password, bio |
| Post | id, title, content, authorId |
| Comment | id, content, authorId, postId |
| Like | id, userId, postId |

## 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npx prisma studio` | 데이터베이스 GUI 실행 |
