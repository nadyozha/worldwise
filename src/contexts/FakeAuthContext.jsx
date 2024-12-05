import { createContext, useContext, useReducer } from "react";
import { FAKE_USER, reducer } from './authUtils';

const AuthContext = createContext();

const initialState = {
	user: null,
	isAuthenticated: false,
};

function AuthProvider({ children }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

	function login(email, password) {
		if (email === FAKE_USER.email && password === FAKE_USER.password) {
			dispatch({ type: 'login', payload: FAKE_USER });
		}
	}

	function logout() {
		dispatch({ type: 'logout' });
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export { AuthProvider, useAuth };
