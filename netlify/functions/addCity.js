import fs from 'fs';
import path from 'path';

exports.handler = async (event, context) => {
	try {
		const newCity = JSON.parse(event.body); // Получаем новый город из запроса
		const dataPath = path.join(__dirname, '../../data/cities.json'); // Путь к файлу cities.json
		const data = fs.readFileSync(dataPath, 'utf-8'); // Чтение текущих данных
		const cities = JSON.parse(data);

		// Генерация уникального id для нового города, если его нет
		if (!newCity.id) {
			newCity.id = (Math.random() + 1).toString(36).substring(7); // Простой способ генерации id
		}

		// Добавляем новый город в массив
		cities.push(newCity);

		// Перезаписываем файл с обновленными данными
		fs.writeFileSync(dataPath, JSON.stringify(cities, null, 2));

		// Возвращаем успешный ответ
		return {
			statusCode: 200,
			body: JSON.stringify(newCity)
		};
	} catch (err) {
		// Логируем ошибку и отправляем статус 500
		console.error('Error adding city:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error adding city' })
		};
	}
};
