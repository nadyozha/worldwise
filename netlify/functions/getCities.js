import fs from 'fs/promises';
import path from 'path';

export default async function handler(event, context) {
	try {
		// Путь к файлу cities.json в директории functions
		const dataPath = path.join(process.cwd(), 'netlify', 'functions', 'cities.json'); // Указываем правильный путь для Netlify
		const data = await fs.readFile(dataPath, 'utf-8');
		const cities = JSON.parse(data);

		return {
			statusCode: 200,
			body: JSON.stringify(cities)
		};
	} catch (err) {
		console.error('Error reading cities data:', err); // Логируем ошибку для отладки
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error reading data' })
		};
	}
}
