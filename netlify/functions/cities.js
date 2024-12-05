const citiesData = {
	cities: [
		{
			cityName: "Lisbon",
			country: "Portugal",
			emoji: "🇵🇹",
			date: "2027-10-31T15:59:59.138Z",
			notes: "My favorite city so far!",
			position: { lat: 38.727881642324164, lng: -9.140900099907554 },
			id: "73930385",
		},
		{
			cityName: "Madrid",
			country: "Spain",
			emoji: "🇪🇸",
			date: "2027-07-15T08:22:53.976Z",
			notes: "",
			position: { lat: 40.46635901755316, lng: -3.7133789062500004 },
			id: "17806751",
		},
		// остальные города
	],
};

exports.handler = async (event) => {
	if (event.httpMethod === "GET") {
		return {
			statusCode: 200,
			body: JSON.stringify(citiesData),
		};
	}

	if (event.httpMethod === "POST") {
		const newCity = JSON.parse(event.body);
		citiesData.cities.push(newCity);
		return {
			statusCode: 201,
			body: JSON.stringify(newCity),
		};
	}

	return {
		statusCode: 405,
		body: JSON.stringify({ error: "Method not allowed" }),
	};
};