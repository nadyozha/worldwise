import styles from './CityList.module.css';
import Spinner from "./Spinner";
import CityItem from './CityItem';
import Message from './Message';
import useCities from '../hooks/useCities';

export default function CityList() {
	const { cities, isLoading } = useCities();

	if (isLoading) return <Spinner />

	if (!cities.length) return <Message message='Add your first city by clicking on the map' />

	return (
		<ul className={styles.cityList}>
			{cities.map(city => <CityItem key={city.id} city={city} />)}
		</ul>
	)
}