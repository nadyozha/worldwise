import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";


export default function Login() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Эталонные данные
	const correctEmail = "jack@example.com";
	const correctPassword = "qwerty";

	// Заполняем правильными данными при загрузке
	const [email, setEmail] = useState(correctEmail);
	const [password, setPassword] = useState(correctPassword);
	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");

	useEffect(() => {
		if (isAuthenticated) navigate("/app", { replace: true });
	}, [isAuthenticated, navigate]);

	function handleSubmit(e) {
		e.preventDefault();
		let valid = true;

		// Проверка email
		if (email !== correctEmail) {
			setErrorEmail("email is incorrect");
			valid = false;
		} else {
			setErrorEmail("");
		}

		// Проверка пароля
		if (password !== correctPassword) {
			setErrorPassword("password is incorrect");
			valid = false;
		} else {
			setErrorPassword("");
		}

		// Если всё верно – логиним пользователя
		if (valid) {
			login(email, password);
		}
	}

	return (
		<main className={styles.login}>
			<PageNav />
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{errorEmail && <p style={{ color: 'red', fontSize: '12px' }}>{errorEmail}</p>}
				</div>

				<div className={styles.row}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{errorPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errorPassword}</p>}
				</div>

				<div>c
					<Button type="primary">Login</Button>
				</div>
			</form>
		</main>
	);
}
