const fs = require('fs');
const path = require('path');

// Путь к файлу cities.json
const filePath = path.join(__dirname, 'cities.json');

exports.handler = async function (event) {
	if (event.httpMethod === 'DELETE') {
		try {
			const cityId = event.queryStringParameters.id;

			const citiesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			citiesData.cities = citiesData.cities.filter(city => city.id !== cityId);

			// Сохранить изменения
			fs.writeFileSync(filePath, JSON.stringify(citiesData, null, 2));

			return {
				statusCode: 200,
				body: JSON.stringify({ message: `Город с ID ${cityId} удалён` }),
			};
		} catch (error) {
			return {
				statusCode: 500,
				body: JSON.stringify({ message: 'Ошибка при удалении города' }),
			};
		}
	}

	return {
		statusCode: 405,
		body: JSON.stringify({ message: 'Метод не поддерживается' }),
	};
};
