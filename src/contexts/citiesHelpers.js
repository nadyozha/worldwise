// const BASE_URL = 'http://localhost:9000';
const BASE_URL = '/.netlify/functions';
// const BASE_URL = '/tmp';

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

export async function fetchCities() {
	const res = await fetch(BASE_URL, { method: 'GET' });
	if (!res.ok) throw new Error('Failed to fetch');
	return res.json();
}

export async function addCity(newCity) {
	const res = await fetch(BASE_URL, {
		method: 'POST',
		body: JSON.stringify(newCity),
		headers: { 'Content-Type': 'application/json' },
	});
	if (!res.ok) throw new Error('Failed to create city');
	return res.json();
}


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
	console.log(id);
	console.log(currentCityId);
	if (id == currentCityId) return;

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

export async function removeCity(cityId) {
	const res = await fetch(`${BASE_URL}?id=${cityId}`, {
		method: 'DELETE',
	});
	if (!res.ok) throw new Error('Failed to delete city');
	return res.json();
}
