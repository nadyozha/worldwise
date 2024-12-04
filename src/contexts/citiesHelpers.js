const BASE_URL = '/.netlify/functions';

export async function fetchCitiesData(dispatch) {
	dispatch({ type: 'loading' });
	try {
		const res = await fetch(`${BASE_URL}/getCities`);
		const data = await res.json();
		// Логируем данные для отладки
		console.log('Fetched data:', data);

		if (data && Array.isArray(data.cities)) {
			dispatch({ type: 'cities/loaded', payload: data.cities });
		} else {
			console.error('Expected an array but received:', data);
			dispatch({ type: 'rejected', payload: 'Data is not an array or missing "cities" property' });
		}
	} catch (error) {
		console.error('Error fetching cities data:', error);
		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
	}
}


export async function addCity(dispatch, newCity) {
	dispatch({ type: 'loading' });
	try {
		const res = await fetch(`${BASE_URL}/addCity`, {
			method: 'POST',
			body: JSON.stringify(newCity),
			headers: { 'Content-Type': 'application/json' },
		});

		// Проверяем, если статус ответа успешный
		if (!res.ok) {
			throw new Error('Failed to add city');
		}

		const data = await res.json();

		// Проверяем, если полученные данные содержат необходимые поля
		if (data && data.city) {
			dispatch({ type: 'city/created', payload: data.city });
		} else {
			dispatch({ type: 'rejected', payload: 'Unexpected data structure' });
		}
	} catch (error) {
		console.error('Error:', error);
		dispatch({ type: 'rejected', payload: 'There was an error creating data' });
	}
}

// export async function fetchCitiesData(dispatch) {
// 	dispatch({ type: 'loading' });
// 	try {
// 		const res = await fetch(`${BASE_URL}/cities`);
// 		const data = await res.json();
// 		dispatch({ type: 'cities/loaded', payload: data });
// 	} catch {
// 		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
// 	}
// }

// export async function addCity(dispatch, newCity) {
// 	dispatch({ type: 'loading' });
// 	try {
// 		const res = await fetch(`${BASE_URL}/cities`, {
// 			method: 'POST',
// 			body: JSON.stringify(newCity),
// 			headers: { 'Content-Type': 'application/json' },
// 		});
// 		const data = await res.json();
// 		dispatch({ type: 'city/created', payload: data });
// 	} catch {
// 		dispatch({ type: 'rejected', payload: 'There was an error creating data' });
// 	}
// }

export async function fetchCityById(dispatch, id, currentCityId) {
	if (Number(id) === currentCityId) return;

	dispatch({ type: 'loading' });
	try {
		const res = await fetch(`${BASE_URL}/cities/${id}`);
		const data = await res.json();
		dispatch({ type: 'city/loaded', payload: data });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
	}
}



export async function removeCity(dispatch, id) {
	dispatch({ type: 'loading' });
	try {
		await fetch(`${BASE_URL}/cities/${id}`, { method: 'DELETE' });
		dispatch({ type: 'city/deleted', payload: id });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error deleting data' });
	}
}
