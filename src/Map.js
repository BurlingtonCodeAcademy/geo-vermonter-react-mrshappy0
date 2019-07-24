import React from "react";
import L from "leaflet";
import borderData from "./border";
import leafletPip from "leaflet-pip"

const style = {
	width: "50%",
	height: "500px"
};

class Map extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		// create map
		this.map = L.map("map", {
			center: [44.4759, -73.2121],
			zoom: 18,
			layers: [
				L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          })
      ]
    })

   this.map.zoomControl.remove();
   this.map.scrollWheelZoom.disable();
   this.map.touchZoom.disable();
   this.map.dragging.disable();
   this.map.keyboard.disable();

    //add polygon
    this.props.polygon.addTo(this.map);

		// add marker
		this.marker = L.marker(this.props.markerPosition).addTo(this.map);

	}

	componentDidUpdate({ markerPosition, startingPosition}) {
    // check if position has changed
    console.log('update called')
    console.log({propsMarker: this.props.markerPosition,  marker: markerPosition})
    console.log({propsStarting: this.props.startingPosition,  Starting: startingPosition})
    
		if (this.props.markerPosition !== markerPosition) {
      console.log('updating markerPosition')
      this.map.panTo(this.props.markerPosition);
    }
    if (this.props.startingPosition !== startingPosition) {
      console.log('updating starterPostition')
      console.log({map: this.map})
      console.log({starterPostition: this.props.startingPosition})
      this.marker.setLatLng(this.props.startingPosition);
      this.map.panTo(this.props.startingPosition);
		}
	}

	render() {
    return (
    <div id="map" style={style} />
    );
	}
}

export default Map;

