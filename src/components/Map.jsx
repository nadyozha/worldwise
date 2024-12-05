import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useCities from '../hooks/useCities';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import styles from './Map.module.css';
import Button from './Button';


function Map() {
	const [mapPosition, setMapPosition] = useState([40, 20]);
	const { cities } = useCities();
	const {
		isLoading: isLoadingPosition,
		position: geoLocationPosition,
		getPosition
	} = useGeolocation();

	const [mapLat, mapLng] = useUrlPosition();


	useEffect(() => {
		if (mapLat && mapLng) {
			setMapPosition([mapLat, mapLng]);
		}
	}, [mapLat, mapLng]);

	useEffect(() => {
		if (geoLocationPosition) setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
	}, [geoLocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type='position' onClick={getPosition}>
					{isLoadingPosition ? 'Loading' : 'Use your position'}
				</Button>)}

			<MapContainer
				center={mapPosition}
				zoom={6}
				scrollWheelZoom={true}
				className={styles.map} >
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities && cities.map(item => (
					<Marker key={item.id} position={[item.position.lat, item.position.lng]}>
						<Popup>
							<span>{item.emoji}</span>
							<span>{item.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	)
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvent({
		click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
		,
	})
}

export default Map;
