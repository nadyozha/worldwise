import fs from 'fs';
import path from 'path';

exports.handler = async (event, context) => {
	try {
		const newCity = JSON.parse(event.body);
		const dataPath = path.join(__dirname, '../../data/cities.json');
		const data = fs.readFileSync(dataPath, 'utf-8');
		const cities = JSON.parse(data);

		// Добавление нового города в массив
		cities.push(newCity);

		// Запись обновленного списка в файл
		fs.writeFileSync(dataPath, JSON.stringify(cities, null, 2));

		return {
			statusCode: 200,
			body: JSON.stringify(newCity)
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error adding city' })
		};
	}
};
