const BASE_URL = '/.netlify/functions';

export async function fetchCitiesData(dispatch) {
	dispatch({ type: 'loading' });
	try {
		const res = await fetch('/.netlify/functions/cities');
		const data = await res.json();

		// Проверяем, что cities — массив
		if (Array.isArray(data.cities)) {
			dispatch({ type: 'cities/loaded', payload: data.cities });
		} else {
			throw new Error('Unexpected data format: cities is not an array');
		}
	} catch (error) {
		console.error(error);
		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
	}
}



export async function addCity(dispatch, newCity) {
	dispatch({ type: 'loading' });
	try {
		const res = await fetch(`${BASE_URL}/cities`, {
			method: 'POST',
			body: JSON.stringify(newCity),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		dispatch({ type: 'city/created', payload: data });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error creating data' });
	}
}

export async function removeCity(dispatch, id) {
	dispatch({ type: 'loading' });
	try {
		await fetch(`${BASE_URL}/city-delete?id=${id}`, { method: 'DELETE' });
		dispatch({ type: 'city/deleted', payload: id });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error deleting data' });
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

// export async function removeCity(dispatch, id) {
// 	dispatch({ type: 'loading' });
// 	try {
// 		await fetch(`${BASE_URL}/cities/${id}`, { method: 'DELETE' });
// 		dispatch({ type: 'city/deleted', payload: id });
// 	} catch {
// 		dispatch({ type: 'rejected', payload: 'There was an error deleting data' });
// 	}
// }
