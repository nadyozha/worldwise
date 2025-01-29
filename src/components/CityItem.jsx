import useCities from '../hooks/useCities';
import styles from './CityItem.module.css';
import { Link } from 'react-router-dom';

const formatDate = (date) =>
	new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "long",
		year: "numeric",
		weekday: "long",
	}).format(new Date(date));

export default function CityItem({ city }) {
	const { currentCity, deleteCity } = useCities();
	const { cityName, emoji, date, id, position } = city;
	const { lat, lng } = position;

	function handleClick(e) {
		e.preventDefault();
		deleteCity(id);
	}

	if (!city.position) {
		// показываем заглушку вместо lat/lng
		return <div>{city.cityName} (No coordinates)</div>;
	}

	return (
		<li>
			<Link to={`${id}?lat=${lat}&lng=${lng}`} className={`${styles.cityItem} ${currentCity.id === id ? styles['cityItem--active'] : ''}`}>
				<span className={styles.emoji}>{emoji}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>{formatDate(date)}</time>
				<button className={styles.deleteBtn} onClick={handleClick}>&times;</button>
			</Link>
		</li>
	)
}



// import PropTypes from 'prop-types';
// CityItem.propTypes = {
//     city: PropTypes.object.isRequired
// };