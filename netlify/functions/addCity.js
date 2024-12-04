// netlify/functions/addCity.js
import fs from 'fs';
import path from 'path';

exports.handler = async (event, context) => {
	const newCity = JSON.parse(event.body);
	try {
		const dataPath = path.join(__dirname, '../../data/cities.json');
		const data = fs.readFileSync(dataPath, 'utf-8');
		const cities = JSON.parse(data);

		cities.push(newCity); // Добавляем новый город в массив
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
