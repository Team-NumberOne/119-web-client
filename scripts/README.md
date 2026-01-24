# 음성 파일 생성 스크립트

모든 질문 텍스트를 자동으로 음성 파일로 변환하는 스크립트입니다.

## 사용 방법

### 방법 1: macOS say 명령어 사용 (권장, 간단함)

```bash
# 모든 상황의 음성 파일 생성
node scripts/generate-audio-from-callscript.js

# 특정 상황만 생성
node scripts/generate-audio-from-callscript.js --situation fire-far
```

**장점:**
- 추가 설치 불필요 (macOS 기본 제공)
- 무료
- 즉시 사용 가능

**단점:**
- 음질이 다소 기계적
- AIFF 파일로 생성되며, MP3 변환을 위해 `ffmpeg` 필요

**MP3 변환:**
```bash
# ffmpeg 설치
brew install ffmpeg

# 변환 (스크립트가 자동으로 변환 시도)
```

### 방법 2: Google TTS API 사용 (더 나은 품질)

```bash
# API 키 설정 후 실행
GOOGLE_TTS_API_KEY=your_api_key node scripts/generate-audio-files.js --api google
```

**장점:**
- 자연스러운 음성 품질
- MP3 형식으로 직접 생성
- 한국어 최적화

**단점:**
- Google Cloud 계정 및 API 키 필요
- 유료 (월 무료 할당량 있음)

**Google TTS API 키 발급:**
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성
3. "Text-to-Speech API" 활성화
4. API 키 생성
5. 환경변수로 설정

## 스크립트 설명

### `generate-audio-from-callscript.js` (권장)
- `callScript.ts` 파일을 직접 읽어서 텍스트 추출
- 가장 정확하고 최신 데이터 사용
- macOS `say` 명령어 사용

### `generate-audio-files.js`
- Google TTS API 지원 포함
- 더 복잡한 기능 제공

### `generate-audio-files-simple.js`
- `AUDIO_FILES_GUIDE.md` 기반으로 생성
- 간단하지만 가이드 파일과 동기화 필요

## 출력 파일 위치

생성된 파일은 `public/audio/{situationId}/` 디렉토리에 저장됩니다:

```
public/audio/
├── fire-far/
│   ├── start.mp3
│   ├── question-1.mp3
│   └── ...
├── fire-near/
│   └── ...
└── ...
```

## 문제 해결

### "say: command not found"
- macOS에서만 사용 가능합니다
- Linux/Windows에서는 다른 방법 사용 필요

### "ffmpeg: command not found"
- AIFF 파일이 생성되지만 MP3 변환 실패
- `brew install ffmpeg`로 설치 후 재실행

### 음성 품질이 마음에 들지 않음
- Google TTS API 사용 권장
- 또는 실제 사람이 녹음한 파일로 교체

## 참고

- 생성된 파일은 `callScript.ts`의 `audioUrl` 경로와 일치합니다
- 기존 파일이 있으면 덮어씁니다
- HTML 태그(`<br/>` 등)는 자동으로 제거됩니다
