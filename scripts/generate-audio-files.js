#!/usr/bin/env node

/**
 * 음성 파일 자동 생성 스크립트
 *
 * 사용 방법:
 * 1. macOS say 명령어 사용 (기본):
 *    node scripts/generate-audio-files.js
 *
 * 2. Google TTS API 사용 (더 나은 품질):
 *    GOOGLE_TTS_API_KEY=your_api_key node scripts/generate-audio-files.js --api google
 *
 * 3. 특정 상황만 생성:
 *    node scripts/generate-audio-files.js --situation fire-far
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// callScript.ts 파일 경로
const CALL_SCRIPT_PATH = path.join(
	__dirname,
	"../app/(default)/practice/[situationId]/[detailId]/dial/call/constants/callScript.ts",
);
const AUDIO_BASE_DIR = path.join(__dirname, "../public/audio");

// callScript.ts 파일을 읽어서 텍스트 추출
function extractTextsFromCallScript() {
	const content = fs.readFileSync(CALL_SCRIPT_PATH, "utf-8");
	const scripts = {};

	// CALL_SCRIPTS 객체 내부의 각 상황별로 파싱
	// 상황 ID와 그 다음 중괄호 블록을 찾기
	const situationPattern = /"([a-z-]+)":\s*\{/g;
	let match;
	const situationIds = [];

	// 모든 상황 ID 찾기
	// biome-ignore lint/suspicious/noAssignInExpressions: 정규식 exec 패턴
	while ((match = situationPattern.exec(content)) !== null) {
		situationIds.push({
			id: match[1],
			startPos: match.index + match[0].length,
		});
	}

	// 각 상황별로 블록 추출
	for (let i = 0; i < situationIds.length; i++) {
		const situationId = situationIds[i].id;
		const startPos = situationIds[i].startPos;
		const endPos =
			i < situationIds.length - 1
				? situationIds[i + 1].startPos - 10
				: content.length;

		const blockContent = content.substring(startPos, endPos);

		// start 텍스트와 startAudioUrl 추출
		const startMatch = blockContent.match(/start:\s*"([^"]+)"/);
		const startAudioMatch = blockContent.match(/startAudioUrl:\s*"([^"]+)"/);

		if (!startMatch) {
			console.warn(`⚠ ${situationId}: start 텍스트를 찾을 수 없습니다.`);
			continue;
		}

		const startText = startMatch[1];
		const startAudioUrl = startAudioMatch ? startAudioMatch[1] : null;

		// questions 배열 추출 - 더 정확한 패턴 사용
		const questions = [];
		const questionPattern =
			/\{\s*question:\s*"([^"]+)"[\s\S]*?audioUrl:\s*"([^"]+)"/g;
		let questionMatch;

		// biome-ignore lint/suspicious/noAssignInExpressions: 정규식 exec 패턴
		while ((questionMatch = questionPattern.exec(blockContent)) !== null) {
			questions.push({
				text: questionMatch[1],
				audioUrl: questionMatch[2],
			});
		}

		if (questions.length === 0) {
			console.warn(`⚠ ${situationId}: 질문을 찾을 수 없습니다.`);
			continue;
		}

		scripts[situationId] = {
			start: { text: startText, audioUrl: startAudioUrl },
			questions,
		};
	}

	return scripts;
}

// HTML 태그 제거 (예: <br/>, </br>)
function cleanText(text) {
	let cleaned = text
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<\/?[^>]+(>|$)/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	// "119"를 "일일구"로 변환
	cleaned = cleaned.replace(/\b119\b/g, "일일구");

	return cleaned;
}

// macOS say 명령어로 음성 파일 생성
function generateWithSay(text, outputPath) {
	console.log(`[say] 생성 중: ${outputPath}`);
	console.log(`  텍스트: ${text}`);

	// say 명령어로 AIFF 파일 생성 후 ffmpeg로 MP3 변환
	const tempFile = outputPath.replace(".mp3", ".aiff");

	try {
		// say 명령어 실행 (한국어 음성: Yuna 사용)
		execSync(`say -v Yuna -o "${tempFile}" "${cleanText(text)}"`, {
			stdio: "inherit",
		});

		// ffmpeg로 MP3 변환 (ffmpeg가 설치되어 있는 경우)
		try {
			execSync(
				`ffmpeg -i "${tempFile}" -acodec libmp3lame -ab 128k "${outputPath}" -y`,
				{ stdio: "inherit" },
			);
			fs.unlinkSync(tempFile); // 임시 파일 삭제
			console.log(`  ✓ 완료: ${outputPath}\n`);
		} catch (_e) {
			// ffmpeg가 없으면 AIFF 파일을 그대로 사용하거나 경고
			console.warn(`  ⚠ ffmpeg가 없어서 AIFF 파일로 저장됩니다: ${tempFile}`);
			console.warn(
				`  MP3로 변환하려면: ffmpeg -i "${tempFile}" -acodec libmp3lame -ab 128k "${outputPath}"`,
			);
		}
	} catch (error) {
		console.error(`  ✗ 오류: ${error.message}\n`);
		throw error;
	}
}

// Google TTS API로 음성 파일 생성
async function generateWithGoogleTTS(text, outputPath, apiKey) {
	console.log(`[Google TTS] 생성 중: ${outputPath}`);
	console.log(`  텍스트: ${text}`);

	const https = require("https");
	const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

	const data = JSON.stringify({
		input: { text: cleanText(text) },
		voice: {
			languageCode: "ko-KR",
			name: "ko-KR-Wavenet-A", // 한국어 여성 음성
			ssmlGender: "FEMALE",
		},
		audioConfig: {
			audioEncoding: "MP3",
			speakingRate: 1.0,
			pitch: 0,
		},
	});

	return new Promise((resolve, reject) => {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		const req = https.request(url, options, (res) => {
			let responseData = "";

			res.on("data", (chunk) => {
				responseData += chunk;
			});

			res.on("end", () => {
				if (res.statusCode === 200) {
					const result = JSON.parse(responseData);
					const audioContent = Buffer.from(result.audioContent, "base64");
					fs.writeFileSync(outputPath, audioContent);
					console.log(`  ✓ 완료: ${outputPath}\n`);
					resolve();
				} else {
					reject(
						new Error(
							`Google TTS API 오류: ${res.statusCode} - ${responseData}`,
						),
					);
				}
			});
		});

		req.on("error", reject);
		req.write(data);
		req.end();
	});
}

// 메인 함수
async function main() {
	const args = process.argv.slice(2);
	const useGoogleTTS =
		args.includes("--api") && args[args.indexOf("--api") + 1] === "google";
	const situationFilter = args.includes("--situation")
		? args[args.indexOf("--situation") + 1]
		: null;

	if (useGoogleTTS && !process.env.GOOGLE_TTS_API_KEY) {
		console.error(
			"❌ Google TTS API를 사용하려면 GOOGLE_TTS_API_KEY 환경변수를 설정해주세요.",
		);
		console.error(
			"   예: GOOGLE_TTS_API_KEY=your_key node scripts/generate-audio-files.js --api google",
		);
		process.exit(1);
	}

	console.log("📝 callScript.ts에서 텍스트 추출 중...\n");
	const scripts = extractTextsFromCallScript();

	const situations = situationFilter ? [situationFilter] : Object.keys(scripts);

	console.log(`🎤 총 ${situations.length}개 상황의 음성 파일 생성 시작...\n`);

	let totalFiles = 0;
	let successCount = 0;
	let errorCount = 0;

	for (const situationId of situations) {
		if (!scripts[situationId]) {
			console.warn(`⚠ 상황을 찾을 수 없습니다: ${situationId}`);
			continue;
		}

		const script = scripts[situationId];
		const audioDir = path.join(AUDIO_BASE_DIR, situationId);

		// 디렉토리 생성
		if (!fs.existsSync(audioDir)) {
			fs.mkdirSync(audioDir, { recursive: true });
		}

		console.log(`\n📁 [${situationId}] 처리 중...`);

		// start 파일 생성
		if (script.start?.audioUrl) {
			// /audio/... 경로를 public/audio/...로 변환
			const audioPath = script.start.audioUrl.startsWith("/")
				? script.start.audioUrl.substring(1)
				: script.start.audioUrl;
			const outputPath = path.join(__dirname, "..", "public", audioPath);
			totalFiles++;
			try {
				if (useGoogleTTS) {
					await generateWithGoogleTTS(
						script.start.text,
						outputPath,
						process.env.GOOGLE_TTS_API_KEY,
					);
				} else {
					generateWithSay(script.start.text, outputPath);
				}
				successCount++;
			} catch (error) {
				console.error(`  ✗ 실패: ${error.message}`);
				errorCount++;
			}
		}

		// question 파일들 생성
		for (const question of script.questions) {
			if (question.audioUrl) {
				// /audio/... 경로를 public/audio/...로 변환
				const audioPath = question.audioUrl.startsWith("/")
					? question.audioUrl.substring(1)
					: question.audioUrl;
				const outputPath = path.join(__dirname, "..", "public", audioPath);
				totalFiles++;
				try {
					if (useGoogleTTS) {
						await generateWithGoogleTTS(
							question.text,
							outputPath,
							process.env.GOOGLE_TTS_API_KEY,
						);
					} else {
						generateWithSay(question.text, outputPath);
					}
					successCount++;

					// API rate limit 방지를 위한 딜레이 (Google TTS만)
					if (useGoogleTTS) {
						await new Promise((resolve) => setTimeout(resolve, 100));
					}
				} catch (error) {
					console.error(`  ✗ 실패: ${error.message}`);
					errorCount++;
				}
			}
		}
	}

	console.log(`\n${"=".repeat(50)}`);
	console.log(`✅ 완료!`);
	console.log(`   총 파일: ${totalFiles}개`);
	console.log(`   성공: ${successCount}개`);
	console.log(`   실패: ${errorCount}개`);
	console.log("=".repeat(50));
}

main().catch(console.error);
