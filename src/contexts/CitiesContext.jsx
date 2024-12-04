import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { fetchCitiesData, fetchCityById, addCity, removeCity } from "./citiesHelpers";

const CitiesContext = createContext();

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: '',
};

function reducer(state, action) {
	switch (action.type) {
		case 'loading':
			return { ...state, isLoading: true };
		case 'cities/loaded':
			return { ...state, isLoading: false, cities: action.payload };
		case 'city/loaded':
			return { ...state, isLoading: false, currentCity: action.payload };
		case 'city/created':
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case 'city/deleted':
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(city => city.id !== action.payload),
				currentCity: {},
			};
		case 'rejected':
			return { ...state, isLoading: false, error: action.payload };
		default:
			throw new Error('Unknown action type');
	}
}

function CitiesProvider({ children }) {
	const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		fetchCitiesData(dispatch);
	}, []);

	const getCity = useCallback((id) => fetchCityById(dispatch, id, currentCity.id), [currentCity.id]);
	const createCity = (newCity) => addCity(dispatch, newCity);
	const deleteCity = (id) => removeCity(dispatch, id);

	return (
		<CitiesContext.Provider value={{
			cities,
			isLoading,
			currentCity,
			error,
			getCity,
			createCity,
			deleteCity,
		}}>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined) throw new Error('CitiesContext was used outside the CitiesProvider');
	return context;
}

export { CitiesProvider, useCities };