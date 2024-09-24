
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        // You can add layers to the predetermined slots within the Standard style basemap.
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates ,
        zoom: 5, // Starting zoom
        maxZoom: 9
    });
    new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ closeOnClick: false })
    .setHTML('<h5>more precise location will be provided after booking</h5>'))
    .addTo(map);