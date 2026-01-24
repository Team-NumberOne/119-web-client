#!/usr/bin/env node

/**
 * callScript.ts에서 직접 텍스트를 추출하여 음성 파일 생성
 *
 * 사용 방법:
 * 1. macOS say 명령어 사용 (기본):
 *    node scripts/generate-audio-from-callscript.js
 *
 * 2. Google TTS API 사용 (더 나은 품질):
 *    GOOGLE_TTS_API_KEY=your_api_key node scripts/generate-audio-from-callscript.js --api google
 *
 * 3. 특정 상황만 생성:
 *    node scripts/generate-audio-from-callscript.js --situation fire-far
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

// HTML 태그 제거 및 숫자 변환
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
	const dir = path.dirname(outputPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const fileName = path.basename(outputPath);
	const displayText = text.length > 60 ? `${text.substring(0, 60)}...` : text;

	console.log(`  📝 ${fileName}`);
	console.log(`     "${displayText}"`);

	const tempFile = outputPath.replace(".mp3", ".aiff");

	try {
		// say 명령어 실행 (한국어 음성: Yuna 사용)
		// 특수문자 이스케이프 처리
		const escapedText = cleanText(text).replace(/"/g, '\\"');
		execSync(`say -v Yuna -o "${tempFile}" "${escapedText}"`, {
			stdio: "pipe",
			maxBuffer: 10 * 1024 * 1024, // 10MB
		});

		// ffmpeg로 MP3 변환 시도
		try {
			execSync(
				`ffmpeg -i "${tempFile}" -acodec libmp3lame -ab 128k -ar 44100 "${outputPath}" -y -loglevel error`,
				{
					stdio: "pipe",
				},
			);
			fs.unlinkSync(tempFile);
			console.log(`     ✓ MP3 생성 완료\n`);
			return true;
		} catch (_e) {
			// ffmpeg가 없으면 AIFF 파일 유지
			console.log(`     ✓ AIFF 파일 생성 완료 (MP3 변환 필요)\n`);
			return true;
		}
	} catch (error) {
		console.error(`     ✗ 오류: ${error.message}\n`);
		return false;
	}
}

// Google TTS API로 음성 파일 생성 (재시도 로직 포함)
async function generateWithGoogleTTS(text, outputPath, apiKey, retries = 3) {
	const dir = path.dirname(outputPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const fileName = path.basename(outputPath);
	const displayText = text.length > 60 ? `${text.substring(0, 60)}...` : text;

	console.log(`  📝 ${fileName}`);
	console.log(`     "${displayText}"`);

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

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const result = await new Promise((resolve, reject) => {
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
						const statusCode = res.statusCode;
						if (statusCode === 200) {
							try {
								const result = JSON.parse(responseData);
								resolve(result);
							} catch (error) {
								reject(new Error(`응답 파싱 오류: ${error.message}`));
							}
						} else if (
							statusCode === 502 ||
							statusCode === 500 ||
							statusCode === 503
						) {
							// 일시적 서버 오류는 재시도 가능
							reject(
								new Error(
									`RETRYABLE_ERROR:${statusCode}:${responseData.substring(0, 200)}`,
								),
							);
						} else {
							// 다른 오류는 재시도하지 않음
							reject(
								new Error(
									`Google TTS API 오류: ${statusCode} - ${responseData.substring(0, 200)}`,
								),
							);
						}
					});
				});

				req.on("error", (error) => {
					reject(new Error(`네트워크 오류: ${error.message}`));
				});

				req.setTimeout(30000, () => {
					req.destroy();
					reject(new Error("요청 타임아웃"));
				});

				req.write(data);
				req.end();
			});

			// 성공 시 파일 저장
			const audioContent = Buffer.from(result.audioContent, "base64");
			fs.writeFileSync(outputPath, audioContent);
			console.log(
				`     ✓ MP3 생성 완료 (Google TTS)${attempt > 1 ? ` (재시도 ${attempt}회)` : ""}\n`,
			);
			return true;
		} catch (error) {
			const isRetryable = error.message.includes("RETRYABLE_ERROR");

			if (isRetryable && attempt < retries) {
				const delay = Math.min(1000 * 2 ** (attempt - 1), 5000); // 지수 백오프: 1초, 2초, 4초
				const statusMatch = error.message.match(/RETRYABLE_ERROR:(\d+):/);
				const statusCode = statusMatch ? statusMatch[1] : "오류";
				console.log(
					`     ⚠ ${statusCode} 발생, ${delay}ms 후 재시도 (${attempt}/${retries})...`,
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				console.error(
					`     ✗ 오류: ${error.message.replace("RETRYABLE_ERROR:", "").split(":").slice(1).join(":")}\n`,
				);
				throw error;
			}
		}
	}

	throw new Error("모든 재시도 실패");
}

// 메인 함수
async function main() {
	const args = process.argv.slice(2);
	const situationFilter = args.includes("--situation")
		? args[args.indexOf("--situation") + 1]
		: null;
	const useGoogleTTS =
		args.includes("--api") && args[args.indexOf("--api") + 1] === "google";
	const apiKey = process.env.GOOGLE_TTS_API_KEY;

	if (useGoogleTTS && !apiKey) {
		console.error(
			"❌ Google TTS API를 사용하려면 GOOGLE_TTS_API_KEY 환경변수를 설정해주세요.",
		);
		console.error(
			"   예: GOOGLE_TTS_API_KEY=your_key node scripts/generate-audio-from-callscript.js --api google",
		);
		console.error("\n💡 설정 방법은 scripts/GOOGLE_TTS_SETUP.md를 참고하세요.");
		process.exit(1);
	}

	console.log("📖 callScript.ts 파일 읽는 중...\n");

	let scripts;
	try {
		scripts = extractTextsFromCallScript();
	} catch (error) {
		console.error("❌ callScript.ts 파싱 오류:", error.message);
		process.exit(1);
	}

	const situations = situationFilter ? [situationFilter] : Object.keys(scripts);

	if (situations.length === 0) {
		console.error("❌ 생성할 상황이 없습니다.");
		process.exit(1);
	}

	const method = useGoogleTTS ? "Google TTS API" : "macOS say";
	console.log(
		`🎤 총 ${situations.length}개 상황의 음성 파일 생성 시작... (${method})\n`,
	);

	let totalFiles = 0;
	let successCount = 0;

	for (const situationId of situations) {
		if (!scripts[situationId]) {
			console.warn(`⚠ 상황을 찾을 수 없습니다: ${situationId}\n`);
			continue;
		}

		const script = scripts[situationId];

		console.log(`📁 [${situationId}]`);

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
					const result = await generateWithGoogleTTS(
						script.start.text,
						outputPath,
						apiKey,
					);
					if (result) successCount++;
				} else {
					if (generateWithSay(script.start.text, outputPath)) {
						successCount++;
					}
				}
			} catch (error) {
				console.error(`     ✗ 오류: ${error.message}\n`);
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
						const result = await generateWithGoogleTTS(
							question.text,
							outputPath,
							apiKey,
						);
						if (result) {
							successCount++;
							// API rate limit 방지를 위한 딜레이 (500ms로 증가)
							await new Promise((resolve) => setTimeout(resolve, 500));
						}
					} else {
						if (generateWithSay(question.text, outputPath)) {
							successCount++;
						}
					}
				} catch (error) {
					console.error(`     ✗ 오류: ${error.message}\n`);
				}
			}
		}

		console.log("");
	}

	console.log("=".repeat(60));
	console.log(`✅ 완료!`);
	console.log(`   총 파일: ${totalFiles}개`);
	console.log(`   성공: ${successCount}개`);
	console.log("=".repeat(60));

	// AIFF 파일이 있는지 확인
	const aiffFiles = [];
	for (const situationId of situations) {
		if (scripts[situationId]) {
			const audioDir = path.join(AUDIO_BASE_DIR, situationId);
			if (fs.existsSync(audioDir)) {
				const files = fs.readdirSync(audioDir);
				aiffFiles.push(
					...files
						.filter((f) => f.endsWith(".aiff"))
						.map((f) => path.join(audioDir, f)),
				);
			}
		}
	}

	if (aiffFiles.length > 0) {
		console.log("\n💡 AIFF 파일이 생성되었습니다. MP3로 변환하려면:");
		console.log("   1. ffmpeg 설치: brew install ffmpeg");
		console.log("   2. 변환 명령어:");
		aiffFiles.slice(0, 3).forEach((file) => {
			const mp3File = file.replace(".aiff", ".mp3");
			console.log(
				`      ffmpeg -i "${file}" -acodec libmp3lame -ab 128k -ar 44100 "${mp3File}"`,
			);
		});
		if (aiffFiles.length > 3) {
			console.log(`   ... 외 ${aiffFiles.length - 3}개 파일`);
		}
	}
}

main().catch((error) => {
	console.error("❌ 실행 오류:", error.message);
	process.exit(1);
});
