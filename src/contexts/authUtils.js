export const FAKE_USER = {
	name: "Jack",
	email: "jack@example.com",
	password: "qwerty",
	avatar: "https://i.pravatar.cc/100?u=zz",
};

export function reducer(state, action) {
	switch (action.type) {
		case 'login':
			return {
				...state,
				isAuthenticated: true,
				user: action.payload,
			};
		case 'logout':
			return {
				...state,
				isAuthenticated: false,
				user: null,
			};
		default:
			throw new Error('Unknown action type');
	}
}
