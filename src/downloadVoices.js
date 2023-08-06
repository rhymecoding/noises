import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import voices from './voices.json' assert { type: 'json' };

const download = async (url, dest) => {
	https
		.get(url, (response) => {
			const statusCode = response.statusCode;

			if (statusCode !== 200) {
				console.error(`请求失败，状态码：${statusCode}`);
				response.resume();
				return;
			}

			// 创建可写流并保存图片
			const file = fs.createWriteStream(dest);
			response.pipe(file);

			file.on('finish', () => {
				console.log(`${url}下载完成`);
				file.close();
			});
		})
		.on('error', (error) => {
			console.error(`${url}请求发生错误：${error.message}`);
		});
};

voices.forEach(async (voice, i) => {
	await download(
		voice.img,
		`${path.dirname(fileURLToPath(import.meta.url))}/../static/img/${i + 1}.png`
	);
	await download(
		voice.voice,
		`${path.dirname(fileURLToPath(import.meta.url))}/../static/voice/${i + 1}.ogg`
	);
});
