# JS Fallback Loader

여러 개의 스크립트 URL 중 하나라도 성공적으로 로드될 때까지 순차적으로 시도하는 자바스크립트 유틸리티입니다.  
jQuery가 존재하면 `$.Deferred`와 `$.getScript`를 사용하고, 없으면 순수 JavaScript(Promise)를 사용합니다.  
각 시도별 타임아웃(ms) 설정이 가능합니다.

---

## 사용 방법

### 1. HTML에 스크립트 추가
```html
<script src="https://cdn.jsdelivr.net/gh/choisunki/fallback@v1.0.1/fall.min.js"></script>
```

### 2. 기본 호출 예시
```javascript
works.getScriptWithFallback(
  [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
  ],
  5000 // 각 URL별 5초 타임아웃
).then(function(url) {
  console.log("Loaded from:", url);
}).catch(function() {
  console.error("All scripts failed to load");
});
```

### 3. 동작 방식
	1.	첫 번째 URL부터 순차적으로 로드 시도
	2.	onload 이벤트 발생 시 즉시 성공 처리
	3.	onerror 또는 타임아웃 발생 시 다음 URL 시도
	4.	모든 URL이 실패하면 reject 처리


***

## 변경 이력

### v1.0.1
- 각 스크립트 로드 시도에 타임아웃 기능 추가
- 순수 JS 로드 방식 개선 (script 제거 및 다음 시도 처리 안정화)
- 코드 주석 보강 및 가독성 향상

### v1.0.0
- 기본 Fallback 로딩 기능 구현
- jQuery가 있을 경우 $.Deferred 방식 지원
- 순수 JS(Promise) 로드 지원
