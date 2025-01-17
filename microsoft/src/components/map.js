import { useState, useRef, useCallback, useEffect } from "react";
import ReactMapGL, { FullscreenControl, GeolocateControl, NavigationControl, Marker } from "react-map-gl";
import Pin from "./pin";
import axios from "axios";

// eslint-disable-next-line import/no-webpack-loader-syntax
// import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function Map() {
	const [viewport, setViewport] = useState({
		latitude: 48.3794,
		longitude: 31.1656,
		zoom: 5
	});

	const [marker, setMarker] = useState([]);
	const mapRef = useRef();

	const handleViewportChange = useCallback(
		(newViewport) => setViewport(newViewport),
		[]
	);

	const handleGeocoderViewportChange = useCallback(
		(newViewport) => {
			const geocoderDefaultOverrides = { transitionDuration: 1000 };

			return handleViewportChange({
				...newViewport,
				...geocoderDefaultOverrides
			});
		},
		[handleViewportChange]
	);

	useEffect(() => {
		axios.get("/api/entry", { withCredentials: true })
			.then(res => {
				if (res.status === 200) {
					console.log(res.data);
					setMarker(res.data?.map((e) =>
						<Marker key={e.createdAt} latitude={e.latitude} longitude={e.longitude}>
							<Pin size={10} />
						</Marker>
					));
				}
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return (
		<div style={{ height: "80vh" }}>
			<ReactMapGL
				{...viewport}
				ref={mapRef}
				width="100%"
				height="100%"
				mapStyle="mapbox://styles/mapbox/light-v9"
				onViewportChange={handleViewportChange}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
			>
				<FullscreenControl />
				<NavigationControl />
				<GeolocateControl
					positionOptions={{ enableHighAccuracy: true }}
					trackUserLocation={true}
				/>
				{marker}
			</ReactMapGL>
		</div>
	);
}