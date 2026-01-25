# 음성 파일 디렉토리

이 디렉토리에는 `fire-far` 상황에 대한 음성 파일들이 들어갑니다.

## 파일 구조

```
public/audio/
├── fire-far/
│   ├── start.mp3          # 시작 음성: "119입니다. 어떤 일이 발생했나요?"
│   ├── question-1.mp3     # 질문 1: "119입니다. 어떤 일이 발생했나요?"
│   ├── question-2.mp3     # 질문 2: "그 위치가 어디인가요?"
│   ├── question-3.mp3     # 질문 3: "사람이 더 있나요?"
│   ├── question-4.mp3     # 질문 4: "불이 번지나요?"
│   └── question-5.mp3     # 질문 5: "신고자분의 이름과 연락처로 알려주세요."
├── fire-near/
│   └── ...
├── emergency-friend/
│   └── ...
└── ...
```

## 음성 파일 형식

- **형식**: MP3 (권장) 또는 WAV, OGG
- **비트레이트**: 128kbps 이상 권장
- **샘플레이트**: 44.1kHz 권장
- **채널**: 모노 또는 스테레오

## 사용 방법

1. 음성 파일을 녹음하거나 준비합니다.
2. 파일명을 위 구조에 맞게 명명합니다.
3. `callScript.ts`의 `audioUrl` 필드에 경로를 지정합니다.

예시:
```typescript
{
  category: "무엇이",
  question: "119입니다. 어떤 일이 발생했나요?",
  hintTitle: "무슨일이",
  hintDescription: "일어났는지 천천히 말해봐요",
  audioUrl: "/audio/fire-far/question-1.mp3",
}
```
