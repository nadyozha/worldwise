import { createContext, useEffect, useState } from "react";

// const BASE_URL = 'http://localhost:9000';
const BASE_URL = '/.netlify/functions';
// const BASE_URL = '/tmp';

const CitiesContext = createContext();

function CitiesProvider({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	useEffect(function () {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch {
				console.log('There was an error loading data');
			} finally {
				setIsLoading(false);
			}
		}

		fetchCities();
	}, [])

	async function getCity(id) {
		if (currentCity.id === id) return;
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch (error) {
			console.log('There was an error loading data')
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteCity(id) {
		try {
			setIsLoading(true);
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			});

			setCities(cities => cities.filter(city => city.id !== id));
		} catch (error) {
			console.log('There was an error deleting data')
		} finally {
			setIsLoading(false);
		}
	}

	async function createCity(newCity) {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: {
					'Content-Type': 'application/json'
				},
			});
			const data = await res.json();

			setCities(cities => [...cities, data]);

		} catch (error) {
			console.log('There was an error creating data')
		} finally {
			setIsLoading(false);
		}
	}


	return (
		<CitiesContext.Provider value={{
			cities: cities,
			isLoading: isLoading,
			currentCity: currentCity,
			getCity,
			createCity,
			deleteCity,
		}}>
			{children}
		</CitiesContext.Provider>
	)
}

export { CitiesProvider, CitiesContext };
