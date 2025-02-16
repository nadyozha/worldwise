const fs = require('fs');
const path = require('path');

// Исходный путь к файлу в папке data (read-only)
const sourcePath = path.join(process.cwd(), 'data', 'cities.json');
// Путь к файлу во временной директории /tmp (доступно для записи)
const tempPath = '/tmp/cities.json';

// Функция для обеспечения наличия файла во временной директории
function ensureTempFile() {
	if (!fs.existsSync(tempPath)) {
		// Копируем исходный файл во временную директорию
		fs.copyFileSync(sourcePath, tempPath);
	}
}

exports.handler = async (event) => {
	// Обеспечиваем, что файл в /tmp существует
	ensureTempFile();

	// Читаем данные из временного файла
	const fileData = fs.readFileSync(tempPath, 'utf-8');
	let json = JSON.parse(fileData); // Ожидаем объект вида { "cities": [ ... ] }

	const { httpMethod, path: urlPath, body } = event;

	// Пример URL: "/.netlify/functions/cities" или "/.netlify/functions/cities/12345"
	const segments = urlPath.split('/');
	const lastSegment = segments.pop();
	// Если последний сегмент равен "cities", то ID отсутствует
	const isCitiesSegment = (lastSegment === 'cities');
	const cityId = isCitiesSegment ? null : lastSegment;

	// ----------------- GET -----------------
	if (httpMethod === 'GET') {
		if (isCitiesSegment) {
			// GET /.netlify/functions/cities — вернуть все города
			return {
				statusCode: 200,
				body: JSON.stringify(json.cities),
			};
		} else {
			// GET /.netlify/functions/cities/:id — вернуть один город
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

	// ----------------- POST -----------------
	if (httpMethod === 'POST') {
		// POST /.netlify/functions/cities (добавить новый город)
		// Только если конец пути - "cities"
		if (!isCitiesSegment) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Cannot POST to an ID route' }),
			};
		}

		try {
			const newCity = JSON.parse(body);
			// Если нет ID, генерируем его
			if (!newCity.id) {
				newCity.id = Math.random().toString(36).slice(2);
			}
			json.cities.push(newCity);

			// Сохраняем изменения во временный файл
			fs.writeFileSync(tempPath, JSON.stringify(json, null, 2), 'utf-8');

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

	// ----------------- DELETE -----------------
	if (httpMethod === 'DELETE') {
		// DELETE /.netlify/functions/cities/:id
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

		// Сохраняем изменения во временный файл
		fs.writeFileSync(tempPath, JSON.stringify(json, null, 2), 'utf-8');

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'City deleted', id: cityId }),
		};
	}

	// ----------------- Другие методы -----------------
	return {
		statusCode: 405,
		body: JSON.stringify({ message: `Method ${httpMethod} not allowed` }),
	};
};
