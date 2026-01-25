# Google TTS API 설정 가이드

Google Cloud Text-to-Speech API를 사용하여 더 자연스러운 음성을 생성하는 방법입니다.

## 1단계: Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 (또는 기존 프로젝트 선택)
   - 프로젝트 이름: 예) "119-web-client-tts"

## 2단계: Text-to-Speech API 활성화

1. Google Cloud Console에서 **"API 및 서비스" > "라이브러리"** 이동
2. 검색창에 **"Text-to-Speech API"** 입력
3. **"Cloud Text-to-Speech API"** 선택
4. **"사용 설정"** 클릭

## 3단계: API 키 생성

1. **"API 및 서비스" > "사용자 인증 정보"** 이동
2. 상단 **"+ 사용자 인증 정보 만들기"** 클릭
3. **"API 키"** 선택
4. 생성된 API 키 복사 (예: `AIzaSyC...`)

⚠️ **보안 주의**: API 키는 공개 저장소에 올리지 마세요!

## 4단계: 환경변수 설정

### macOS/Linux (터미널에서)

```bash
# 현재 세션에만 적용
export GOOGLE_TTS_API_KEY="your_api_key_here"

# 영구적으로 적용 (추천)
echo 'export GOOGLE_TTS_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### Windows (PowerShell)

```powershell
# 현재 세션에만 적용
$env:GOOGLE_TTS_API_KEY="your_api_key_here"

# 영구적으로 적용
[System.Environment]::SetEnvironmentVariable('GOOGLE_TTS_API_KEY', 'your_api_key_here', 'User')
```

## 5단계: 스크립트 실행

```bash
# 모든 상황의 음성 파일 생성
GOOGLE_TTS_API_KEY=your_api_key node scripts/generate-audio-files.js --api google

# 또는 환경변수가 이미 설정되어 있다면
node scripts/generate-audio-files.js --api google

# 특정 상황만 생성
node scripts/generate-audio-files.js --api google --situation fire-far
```

## 가격 정보

- **무료 할당량**: 월 0-4백만 문자 (WaveNet/Standard 음성)
- **유료**: $4 per 1백만 문자 (WaveNet/Standard)
- **신규 고객**: $300 무료 크레딧 제공

현재 프로젝트는 약 1,000-2,500자이므로 **무료 할당량으로 충분**합니다.

## 문제 해결

### "API key not valid" 오류
- API 키가 올바른지 확인
- Text-to-Speech API가 활성화되었는지 확인
- 환경변수가 제대로 설정되었는지 확인: `echo $GOOGLE_TTS_API_KEY`

### "API has not been used" 오류
- API가 활성화되기까지 몇 분 걸릴 수 있습니다
- 잠시 후 다시 시도하세요

### 요금 걱정
- 무료 할당량(4백만 문자/월)을 초과하지 않으면 요금이 부과되지 않습니다
- 현재 프로젝트는 매우 작은 규모이므로 걱정하지 않아도 됩니다

## 음성 품질 비교

- **macOS say**: 기계적, 빠름, 무료
- **Google TTS**: 자연스러움, 약간 느림, 무료 할당량 있음

Google TTS가 훨씬 더 자연스럽고 전문적인 음성을 제공합니다.
