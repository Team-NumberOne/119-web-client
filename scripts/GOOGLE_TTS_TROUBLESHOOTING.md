# Google TTS API 502 에러 해결 가이드

## 502 에러 발생 원인

### 1. **일시적 서버 오류 (가장 흔함)**
- Google 서버 측 일시적 문제
- 특정 텍스트 패턴에서 간헐적으로 발생
- **해결**: 재시도 로직이 자동으로 처리합니다 (최대 3회)

### 2. **요청 빈도 문제**
- 너무 빠르게 연속 요청 시 발생
- **해결**: 각 요청 사이에 500ms 딜레이가 있습니다

### 3. **API 키/인증 문제**
- 잘못된 API 키
- API가 활성화되지 않음
- 프로젝트 설정 문제
- **확인 방법**:
  ```bash
  # API 키 확인
  echo $GOOGLE_TTS_API_KEY
  
  # API 활성화 확인
  # Google Cloud Console > API 및 서비스 > 사용 설정된 API
  ```

### 4. **텍스트 길이/형식 문제**
- 특정 텍스트 패턴에서 간헐적 오류
- 5000자 제한 근처에서 발생 가능
- **해결**: 현재 프로젝트는 짧은 텍스트만 사용하므로 문제 없음

## 해결 방법

### 자동 재시도
스크립트에 재시도 로직이 포함되어 있습니다:
- **최대 3회 재시도**
- **지수 백오프**: 1초 → 2초 → 4초 대기
- **502, 500, 503 에러만 재시도** (인증 오류 등은 재시도 안 함)

### 수동 해결

1. **잠시 후 다시 시도**
   ```bash
   # 30초~1분 후 다시 실행
   node scripts/generate-audio-from-callscript.js --api google
   ```

2. **API 키 확인**
   ```bash
   # 환경변수 확인
   echo $GOOGLE_TTS_API_KEY
   
   # 다시 설정
   export GOOGLE_TTS_API_KEY="your_api_key"
   ```

3. **Google Cloud Console 확인**
   - [API 및 서비스 > 사용 설정된 API](https://console.cloud.google.com/apis/library)
   - "Cloud Text-to-Speech API"가 활성화되어 있는지 확인
   - API 키가 제한되어 있는지 확인 (IP 제한 등)

4. **특정 상황만 재생성**
   ```bash
   # 실패한 상황만 다시 생성
   node scripts/generate-audio-from-callscript.js --api google --situation fire-far
   ```

## 예상되는 동작

재시도 로직이 포함된 스크립트 실행 시:

```
📝 start.mp3
   "일일구입니다. 어떤 일이 발생했나요?"
   ⚠ 502 발생, 1000ms 후 재시도 (1/3)...
   ✓ MP3 생성 완료 (Google TTS) (재시도 2회)
```

## 여전히 실패하는 경우

1. **API 키 문제**: Google Cloud Console에서 새 API 키 생성
2. **할당량 초과**: 무료 할당량(4백만 문자/월) 확인
3. **네트워크 문제**: 인터넷 연결 확인
4. **macOS say 사용**: Google TTS 대신 macOS say 명령어 사용
   ```bash
   node scripts/generate-audio-from-callscript.js
   ```

## 참고

- 502 에러는 Google 서버 측 문제이므로 대부분 일시적입니다
- 재시도 로직으로 대부분의 경우 자동 해결됩니다
- 지속적으로 발생하면 Google Cloud 지원팀에 문의하세요
