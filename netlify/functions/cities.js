const fs = require('fs');
const path = require('path');

// Предполагаем, что в корне есть папка "data/cities.json",
// и что вы добавили в netlify.toml:
//   [functions]
//   included_files = ["data/**"]
//
// Тогда файл будет доступен в среде Netlify:
const filePath = path.join(process.cwd(), 'data', 'cities.json');

exports.handler = async (event) => {
	const { httpMethod, path: urlPath, body } = event;

	// Считываем файл cities.json
	const fileData = fs.readFileSync(filePath, 'utf-8');
	const json = JSON.parse(fileData); // Ожидаем { "cities": [ ... ] }

	// Пример:
	//  urlPath: "/.netlify/functions/cities"
	//         или "/.netlify/functions/cities/12345"
	const segments = urlPath.split('/'); // ['', '.netlify', 'functions', 'cities', 'XYZ?']
	const lastSegment = segments.pop();   // либо 'cities', либо 'xyz...'
	const isCitiesSegment = (lastSegment === 'cities'); // true если нет ID
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
		// Только если конец пути - "cities", иначе логика не имеет смысла
		if (!isCitiesSegment) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Cannot POST to an ID route' }),
			};
		}

		try {
			const newCity = JSON.parse(body);
			// Сгенерировать id, если нет
			if (!newCity.id) {
				newCity.id = Math.random().toString(36).slice(2);
			}
			json.cities.push(newCity);

			fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');

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

		// Сохраняем изменения
		fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');

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
