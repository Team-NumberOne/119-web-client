# 음성 파일 가이드

각 상황별로 필요한 음성 파일 목록입니다.

## 파일 구조

```
public/audio/
├── fire-far/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
├── fire-near/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
├── emergency-friend/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   ├── question-5.mp3
│   └── question-6.mp3
├── emergency-family/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
├── injury-me/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
├── injury-other/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
├── drowning-friend/
│   ├── start.mp3
│   ├── question-1.mp3
│   ├── question-2.mp3
│   ├── question-3.mp3
│   ├── question-4.mp3
│   └── question-5.mp3
└── drowning-family/
    ├── start.mp3
    ├── question-1.mp3
    ├── question-2.mp3
    ├── question-3.mp3
    ├── question-4.mp3
    └── question-5.mp3
```

## 각 상황별 질문 내용

### fire-far (멀리 난 불)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "사람이 안에 있나요?"
- question-4: "불이 많이 번졌나요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

### fire-near (바로 앞에 난 불)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "불이 많이 번졌나요?"
- question-4: "신고자 분은 안전한 곳에 계신가요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

### emergency-friend (친구가 쓰러짐)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "친구가 의식이 있나요?"
- question-4: "친구는 남자인가요, 여자인가요? 나이는요?"
- question-5: "다친 흔적이나 피가 보이나요?"
- question-6: "신고자분의 이름과 전화번호 알려주세요."

### emergency-family (보호자가 쓰러짐)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "보호자가 의식있나요?"
- question-4: "다친 흔적이나 피가 보이나요?"
- question-5: "신고자분의 이름과 연락처를 알려주세요."

### injury-me (내가 다침)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "의식은 괜찮으세요? 어디가 가장 아픈가요?"
- question-4: "피가 많이 나거나, 몸이 꺾여 있나요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

### injury-other (친구/가족이 다침)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "의식은 있으신가요? 말을 하거나 눈을 뜨나요?"
- question-4: "어디가 가장 아파 보이나요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

### drowning-friend (친구가 물에 빠짐)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "친구가 지금 물 밖으로 나왔나요, 아직 물 안에 있나요?"
- question-4: "절대 혼자 물에 들어가지 마시고, 튜브, 줄 같은 게 있으면 던져줄 수 있나요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

### drowning-family (가족이 물에 빠짐)
- start: "119입니다. 어떤 일이 발생했나요?"
- question-1: "119입니다. 어떤 일이 발생했나요?"
- question-2: "그 위치가 어디인가요?"
- question-3: "보호자 분이 지금 물 밖으로 나왔나요, 아직 물 안에 있나요?"
- question-4: "절대 혼자 물에 들어가지 마시고, 튜브, 줄 같은 게 있으면 던져줄 수 있나요?"
- question-5: "신고자분의 이름과 전화번호 알려주세요."

## 음성 파일 형식

- **형식**: MP3 (권장) 또는 WAV, OGG
- **비트레이트**: 128kbps 이상 권장
- **샘플레이트**: 44.1kHz 권장
- **채널**: 모노 또는 스테레오

## 사용 방법

1. 위 질문 내용에 맞게 음성 파일을 녹음합니다.
2. 파일명을 위 구조에 맞게 명명합니다 (예: `question-1.mp3`).
3. 해당 상황의 디렉토리에 파일을 넣습니다.
4. `callScript.ts`에는 이미 `audioUrl`이 설정되어 있으므로 추가 작업이 필요 없습니다.
