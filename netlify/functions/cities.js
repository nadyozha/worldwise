const fs = require('fs');
const path = require('path');

// Путь к файлу cities.json
const filePath = path.join(__dirname, 'cities.json');

exports.handler = async function (event) {
	if (event.httpMethod === 'GET') {
		// Вернуть все города
		const citiesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		return {
			statusCode: 200,
			body: JSON.stringify(citiesData),
		};
	}

	if (event.httpMethod === 'POST') {
		// Добавить новый город
		try {
			const newCity = JSON.parse(event.body);

			const citiesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			citiesData.cities.push(newCity);

			// Сохранить изменения
			fs.writeFileSync(filePath, JSON.stringify(citiesData, null, 2));

			return {
				statusCode: 201,
				body: JSON.stringify(newCity),
			};
		} catch (error) {
			return {
				statusCode: 500,
				body: JSON.stringify({ message: 'Ошибка при добавлении города' }),
			};
		}
	}

	return {
		statusCode: 405,
		body: JSON.stringify({ message: 'Метод не поддерживается' }),
	};
};
