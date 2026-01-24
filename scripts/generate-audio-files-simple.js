#!/usr/bin/env node

/**
 * 간단한 버전: macOS say 명령어만 사용
 * callScript.ts를 직접 파싱하지 않고, AUDIO_FILES_GUIDE.md를 기반으로 생성
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const AUDIO_BASE_DIR = path.join(__dirname, "../public/audio");
const GUIDE_PATH = path.join(__dirname, "../public/audio/AUDIO_FILES_GUIDE.md");

// AUDIO_FILES_GUIDE.md에서 텍스트 추출
function extractTextsFromGuide() {
	const content = fs.readFileSync(GUIDE_PATH, "utf-8");
	const scripts = {};

	// 각 상황별 섹션 추출
	const sections = content.split(/###\s+([^\n]+)/);

	for (let i = 1; i < sections.length; i += 2) {
		const situationName = sections[i].trim();
		const sectionContent = sections[i + 1];

		// 상황 ID 추출 (예: "fire-far (멀리 난 불)" -> "fire-far")
		const situationMatch = situationName.match(/^([a-z-]+)\s*\(/);
		if (!situationMatch) continue;

		const situationId = situationMatch[1];
		const items = {};

		// start와 question들 추출
		const lines = sectionContent.split("\n");
		for (const line of lines) {
			const match = line.match(/^- (start|question-\d+):\s*"([^"]+)"/);
			if (match) {
				items[match[1]] = match[2];
			}
		}

		if (Object.keys(items).length > 0) {
			scripts[situationId] = items;
		}
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

	console.log(`[say] 생성 중: ${path.basename(outputPath)}`);
	console.log(
		`  텍스트: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
	);

	const tempFile = outputPath.replace(".mp3", ".aiff");

	try {
		// say 명령어 실행 (한국어 음성: Yuna 사용)
		execSync(`say -v Yuna -o "${tempFile}" "${cleanText(text)}"`, {
			stdio: "pipe",
		});

		// ffmpeg로 MP3 변환 시도
		try {
			execSync(
				`ffmpeg -i "${tempFile}" -acodec libmp3lame -ab 128k "${outputPath}" -y -loglevel error`,
				{ stdio: "pipe" },
			);
			fs.unlinkSync(tempFile);
			console.log(`  ✓ 완료\n`);
			return true;
		} catch (_e) {
			// ffmpeg가 없으면 AIFF 파일 유지
			console.log(`  ✓ AIFF 파일 생성 완료: ${tempFile}`);
			console.log(
				`  ⚠ MP3 변환을 위해 ffmpeg를 설치하거나 수동으로 변환해주세요.\n`,
			);
			return true;
		}
	} catch (error) {
		console.error(`  ✗ 오류: ${error.message}\n`);
		return false;
	}
}

// 메인 함수
function main() {
	const args = process.argv.slice(2);
	const situationFilter = args.includes("--situation")
		? args[args.indexOf("--situation") + 1]
		: null;

	console.log("📝 AUDIO_FILES_GUIDE.md에서 텍스트 추출 중...\n");
	const scripts = extractTextsFromGuide();

	const situations = situationFilter ? [situationFilter] : Object.keys(scripts);

	console.log(`🎤 총 ${situations.length}개 상황의 음성 파일 생성 시작...\n`);

	let totalFiles = 0;
	let successCount = 0;

	for (const situationId of situations) {
		if (!scripts[situationId]) {
			console.warn(`⚠ 상황을 찾을 수 없습니다: ${situationId}`);
			continue;
		}

		const items = scripts[situationId];
		const audioDir = path.join(AUDIO_BASE_DIR, situationId);

		console.log(`\n📁 [${situationId}] 처리 중...`);

		// start 파일 생성
		if (items.start) {
			const outputPath = path.join(audioDir, "start.mp3");
			totalFiles++;
			if (generateWithSay(items.start, outputPath)) {
				successCount++;
			}
		}

		// question 파일들 생성
		for (const [key, text] of Object.entries(items)) {
			if (key.startsWith("question-")) {
				const questionNum = key.replace("question-", "");
				const outputPath = path.join(audioDir, `question-${questionNum}.mp3`);
				totalFiles++;
				if (generateWithSay(text, outputPath)) {
					successCount++;
				}
			}
		}
	}

	console.log(`\n${"=".repeat(50)}`);
	console.log(`✅ 완료!`);
	console.log(`   총 파일: ${totalFiles}개`);
	console.log(`   성공: ${successCount}개`);
	console.log("=".repeat(50));
	console.log("\n💡 참고:");
	console.log("   - AIFF 파일이 생성된 경우, ffmpeg로 MP3 변환이 필요합니다.");
	console.log("   - ffmpeg 설치: brew install ffmpeg");
	console.log(
		"   - 변환 명령어: ffmpeg -i input.aiff -acodec libmp3lame -ab 128k output.mp3",
	);
}

main();
