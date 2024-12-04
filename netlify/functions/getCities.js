import fs from 'fs';
import path from 'path';

exports.handler = async (event, context) => {
	try {
		// Путь к файлу cities.json в вашем проекте
		const dataPath = path.join(__dirname, 'cities.json');
		const data = fs.readFileSync(dataPath, 'utf-8');
		const cities = JSON.parse(data);

		return {
			statusCode: 200,
			body: JSON.stringify(cities)
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error reading data' })
		};
	}
};
