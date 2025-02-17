// netlify/functions/cities.js (CommonJS-синтаксис)

const fs = require('fs');
const path = require('path');

// Путь к исходному файлу (read-only), который лежит в репозитории
const originalFilePath = path.join(process.cwd(), 'data', 'cities.json');

// Путь к временной копии, где мы будем писать
const tmpFilePath = '/tmp/cities.json';

exports.handler = async (event) => {
	const { httpMethod, path: urlPath, body } = event;

	// 1) При первом запуске (или если файл не существует в /tmp),
	//    копируем из оригинального read-only в /tmp
	if (!fs.existsSync(tmpFilePath)) {
		// Считываем read-only
		const originalData = fs.readFileSync(originalFilePath, 'utf-8');
		// Записываем копию в /tmp
		fs.writeFileSync(tmpFilePath, originalData, 'utf-8');
	}

	// 2) Теперь читаем ИМЕННО из /tmp/cities.json
	const fileData = fs.readFileSync(tmpFilePath, 'utf-8');
	const json = JSON.parse(fileData); // { cities: [ ... ] } — предполагаем такую структуру

	// Парсим ID из URL (как в вашем коде)
	const segments = urlPath.split('/');
	const lastSegment = segments.pop();
	const isCitiesSegment = (lastSegment === 'cities');
	const cityId = isCitiesSegment ? null : lastSegment;

	// --------------------- GET ---------------------
	if (httpMethod === 'GET') {
		if (isCitiesSegment) {
			// GET /cities -> вернуть список
			return {
				statusCode: 200,
				body: JSON.stringify(json.cities),
			};
		} else {
			// GET /cities/:id -> вернуть один город
			const city = json.cities.find((c) => c.id === cityId);
			if (!city) {
				return {
					statusCode: 404,
					body: JSON.stringify({ message: 'City not found', id: cityId }),
				};
			}
			return {
				statusCode: 200,
				body: JSON.stringify(city),
			};
		}
	}

	// --------------------- POST ---------------------
	if (httpMethod === 'POST') {
		// POST /cities -> добавить город
		if (!isCitiesSegment) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Cannot POST to an ID route' }),
			};
		}
		try {
			const newCity = JSON.parse(body);

			// Пример простой валидации
			if (!newCity.cityName || !newCity.position) {
				return {
					statusCode: 400,
					body: JSON.stringify({ message: 'Missing cityName or position' }),
				};
			}

			// Генерируем id, если нет
			if (!newCity.id) {
				newCity.id = Math.random().toString(36).slice(2);
			}

			json.cities.push(newCity);

			// Пишем ИМЕННО в /tmp/cities.json
			fs.writeFileSync(tmpFilePath, JSON.stringify(json, null, 2), 'utf-8');

			return {
				statusCode: 201,
				body: JSON.stringify(newCity),
			};
		} catch (error) {
			console.error(error);
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Invalid POST data' }),
			};
		}
	}

	// --------------------- DELETE ---------------------
	if (httpMethod === 'DELETE') {
		// DELETE /cities/:id
		if (!cityId || isCitiesSegment) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Missing city ID in path' }),
			};
		}

		const originalLength = json.cities.length;
		json.cities = json.cities.filter((c) => c.id !== cityId);

		if (json.cities.length === originalLength) {
			// Город не найден
			return {
				statusCode: 404,
				body: JSON.stringify({ message: 'City not found', id: cityId }),
			};
		}

		// Перезаписываем /tmp/cities.json
		fs.writeFileSync(tmpFilePath, JSON.stringify(json, null, 2), 'utf-8');
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'City deleted', id: cityId }),
		};
	}

	// --------------------- Иные методы ---------------------
	return {
		statusCode: 405,
		body: JSON.stringify({ message: `Method ${httpMethod} not allowed` }),
	};
};
