# 파일 경로 표기 규칙 문서

## 1. 개요

프로젝트의 모든 코드 블록에 대한 명확한 파일 위치 참조와 빠른 네비게이션을 위한 표준화된 경로 표기 시스템을 정의합니다.

## 2. 기본 형식

### 2.1 코드 블록 표기 형식
```
[language_id]:project-root/[file_path]
코드 내용
```

### 2.2 예시
```typescript:/src/components/Header.tsx
export const Header = () => {
  return <header>Header Content</header>;
};
```

```css:/src/styles/main.css
.header {
  background-color: #fff;
}
```

## 3. 경로 레벨 구조

### 3.1 Root Level (프로젝트 루트)
- 프로젝트의 최상위 디렉토리에 위치한 파일들
- 예시:
  ```json:/package.json
  {
    "name": "",
    "version": "1.0.0"
  }
  ```

### 3.2 Source Level (src 폴더)
- 소스 코드 디렉토리 내 파일들
- 예시:
  ```typescript:/src/App.tsx
  import React from 'react';
  ```

### 3.3 Component Level (컴포넌트 폴더)
- 컴포넌트 디렉토리 내 파일들
- 예시:
  ```typescript:/src/components/Dashboard/StockList.tsx
  export const StockList = () => {
    return <div>Stock List Component</div>;
  };
  ```

## 4. 주요 특징

### 4.1 링크 기능
- 모든 파일 경로는 클로젝트 루트명을 포함한 전체 경로로 변환
- IDE/에디터에서 직접 파일 열기 지원

### 4.2 구문 강조
- 언어별 적절한 구문 강조 적용
- 지원 언어: typescript, javascript, css, json, markdown 등

### 4.3 경로 표기 일관성
- 항상 프로젝트 루트명부터 시작하는 경로 사용
- 폴더 구분자는 슬래시(/) 사용
- 형식: project-root/path/to/file

## 5. 개발상 이점

### 5.1 코드 네비게이션
- 프로젝트 전체 범위에서 파일 탐색 가능
- 명확한 파일 위치 참조

### 5.2 협업 효율성
- 프로젝트 범위 명확화
- 문서화 품질 향상

### 5.3 유지보수성
- 프로젝트 구조의 명확한 시각화
- 코드 의존성 파악 용이

## 6. 실제 적용 예시

### 6.1 컴포넌트 파일
```typescript:/src/components/ExchangeRate/ExchangeRateDisplay.tsx
import React from 'react';

export const ExchangeRateDisplay: React.FC<Props> = ({ rate }) => {
  return <div className="exchange-rate">{rate}</div>;
};
```

### 6.2 스타일 파일
```css:/src/styles/components/exchange-rate.css
.exchange-rate {
  font-family: monospace;
  color: var(--primary-color);
}
```

### 6.3 설정 파일
```json:/tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

## 7. 주의사항

### 7.1 경로 작성 시
- 반드시 프로젝트 루트명으로 시작
- 정확한 파일 확장자 포함
- 대소문자 구분 준수
- 예: /path/to/file.tsx

### 7.2 코드 블록 작성 시
- 적절한 언어 ID 지정
- 의미 있는 코드 섹션 포함
- 필요한 맥락 정보 제공