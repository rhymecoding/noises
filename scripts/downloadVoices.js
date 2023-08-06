import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import voices from '../src/voices.json' assert { type: 'json' };

const success = [];
const fail = [];

const download = (url, dest) => {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(dest);

		https
			.get(
				url,
				{
					timeout: 30000
				},
				(response) => {
					response.pipe(file);

					file.on('finish', () => {
						console.log(`${url} => ${dest} 下载完成`);
						success.push(`${url} => ${dest}`);
						file.close();
						resolve();
					});
				}
			)
			.on('error', (error) => {
				fail.push(`url => ${dest}`);
				reject(`url => ${dest}请求发生错误`);
			});
	});
};

let i = 0;
for await (const voice of voices) {
	i++;
	try {
		await download(
			voice.img,
			`${path.dirname(fileURLToPath(import.meta.url))}/../static/img/${i}.png`
		);
		await download(
			voice.voice,
			`${path.dirname(fileURLToPath(import.meta.url))}/../static/voice/${i}.ogg`
		);
	} catch (error) {
		console.log(error);
	}
}

console.log(`成功${success.length}个，失败${fail.length}个`);
fail.length && console.dir(fail);
