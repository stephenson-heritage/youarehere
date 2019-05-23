mapboxgl.accessToken =
	"pk.eyJ1Ijoic3RlcGhlbnNvbi1oZXJpdGFnZSIsImEiOiJjanZ4ejlxazMwYWRlNDhrOHJxN2hlZGl5In0.GvwpDRkNHQKPfS8S2SA4Dg";

const geoIp =
	"https://api.ipgeolocation.io/ipgeo?apiKey=c461a284199842f893dc5ec8561c9a7a";

const geocodeURI = address => {
	return (
		"https://api.opencagedata.com/geocode/v1/json?q=" +
		address +
		"&key=e56256f1a360434bac0898473197dd36"
	);
};

let map = null;
let locInfo = null;
let loading = null;

const centerOnUser = async () => {
	if (map !== null) {
		let mapInfo = await fetch(geoIp);
		let mapInfoJSON = await mapInfo.json();

		let loc = [mapInfoJSON.longitude, mapInfoJSON.latitude];
		map.easeTo({ center: loc });

		return mapInfoJSON;
	}
};

document.addEventListener("DOMContentLoaded", async () => {
	loading = document.getElementById("loading");

	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/stephenson-heritage/cjvxzf5s96jcy1cmptnuxdskv",
		center: [-75.765, 45.4553],
		zoom: 16
	});

	document.getElementById("btnFindIt").addEventListener("click", async () => {
		let address = document.getElementById("txtAddress").value;
		address = address.trim();
		// console.log(address);
		if (address.length >= 3) {
			// console.log(geocodeURI(address));
			const data = await fetch(geocodeURI(address));
			const dataJson = await data.json();
			console.log(dataJson);
			if (dataJson.results.length >= 1) {
				const geo = dataJson.results[0].geometry;
				// console.log(geo);
				map.easeTo({ center: [geo.lng, geo.lat] });
			}
		}
	});

	document.getElementById("easeToTokyo").addEventListener("click", async () => {
		loading.style.display = "block";

		const data = await fetch(geocodeURI("Tokyo"));
		const dataJson = await data.json();
		// console.log(dataJson);
		const tokyo = dataJson.results[0].geometry;
		loading.style.display = "none";
		map.easeTo({ center: [tokyo.lng, tokyo.lat] });
	});
	document.getElementById("easeHome").addEventListener("click", async () => {
		if (locInfo === null) {
			locInfo = await centerOnUser();
		} else {
			map.easeTo({ center: [locInfo.longitude, locInfo.latitude] });
		}
	});
	locInfo = await centerOnUser();

	let userMarker = new mapboxgl.Marker()
		.setLngLat([locInfo.longitude, locInfo.latitude])
		.setPopup(
			new mapboxgl.Popup({ className: "here" }).setHTML(
				'<h1>you are here</h1><img src="' + locInfo.country_flag + '" />'
			)
		)
		.addTo(map)
		.togglePopup();
});
