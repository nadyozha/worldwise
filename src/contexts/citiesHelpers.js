export const BASE_URL = 'http://localhost:9000';
// export const BASE_URL = '/.netlify/functions';

// export async function fetchCitiesData(dispatch) {
// 	dispatch({ type: 'loading' });
// 	try {
// 		const res = await fetch(`${BASE_URL}/getCities`);
// 		const data = await res.json();
// 		dispatch({ type: 'cities/loaded', payload: data });
// 	} catch {
// 		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
// 	}
// }

// export async function addCity(dispatch, newCity) {
// 	dispatch({ type: 'loading' });
// 	try {
// 		const res = await fetch(`${BASE_URL}/addCity`, {
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

export async function fetchCitiesData(dispatch) {
	dispatch({ type: 'loading' });
	try {
		const res = await fetch(`${BASE_URL}/cities`);
		const data = await res.json();
		dispatch({ type: 'cities/loaded', payload: data });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error loading data' });
	}
}

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
		await fetch(`${BASE_URL}/cities/${id}`, { method: 'DELETE' });
		dispatch({ type: 'city/deleted', payload: id });
	} catch {
		dispatch({ type: 'rejected', payload: 'There was an error deleting data' });
	}
}
