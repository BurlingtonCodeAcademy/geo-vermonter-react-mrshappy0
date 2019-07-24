import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map";
import leafletPip from "leaflet-pip";
import L from "leaflet";
import borderData from "./border";
import counties from "./counties";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			
			startButton: false,
			guessDisabled: true,
			quitDisabled: true,
			startingPosition: { lat: 44.4759, lng: -73.2121 },
			markerPosition: { lat: 44.4759, lng: -73.2121 },
			markerReveal: {lat: null,lng: null},
			countyReveal: null,
			polygon: L.geoJSON(borderData),
			counties: L.geoJSON(counties)
		};
		this.moveMarkerNorth = this.moveMarkerNorth.bind(this);
		this.moveMarkerSouth = this.moveMarkerSouth.bind(this);
		this.moveMarkerEast = this.moveMarkerEast.bind(this);
		this.moveMarkerWest = this.moveMarkerWest.bind(this);
		this.startButton = this.startButton.bind(this);
		this.guessButton = this.guessButton.bind(this);
		this.quitButton = this.quitButton.bind(this);
		this.checkWithin = this.checkWithin.bind(this);
	}

	checkWithin() {
    console.log("checking")
    let LatLon = this.randomLatLon();
    console.log({theLayer: this.state.polygon})
    while(!leafletPip.pointInLayer(LatLon, this.state.polygon).length) {
      LatLon = this.randomLatLon();
    }
    console.log({LatLon});
    return LatLon; 
  }
  
	randomLatLon() {
		let lat = Math.random(45.01666495 - 42.72693285) + 42.72693285;
		let lng = -1 * (Math.random(73.43774001 - 71.46535674) + 71.46535674);
		return [lng, lat];
	}

	quitButton() {
		let latlon = this.state.startingPosition;
		const withinCounties = leafletPip.pointInLayer(this.state.startingPosition, this.state.counties);
		console.log(withinCounties[0].feature.properties.CNTYNAME);
		this.setState({
			quitDisabled: true,
			markerReveal: {
				lat: latlon.lat,
				lng: latlon.lng
			},
			countyReveal: withinCounties[0].feature.properties.CNTYNAME,
		});
	}

	startButton() {
    let LatLonReturn = this.checkWithin();
    console.log({LatLonReturn})
		this.setState({
			startButton: true,
			guessDisabled: false,
			quitDisabled: false,
			markerPosition: {
				lat: LatLonReturn[1],
				lng: LatLonReturn[0]
			},
			startingPosition: {
				lat: LatLonReturn[1],
				lng: LatLonReturn[0]
			}
		});
	}

	guessButton() {
		this.setState({
			guessDisabled: true
		});
	}

	moveMarkerNorth() {
		const { lat, lng } = this.state.markerPosition;
		this.setState({
			markerPosition: {
				lat: lat + 0.005,
				lng: lng + 0.0
			}
		});
	}

	moveMarkerSouth() {
		const { lat, lng } = this.state.markerPosition;
		this.setState({
			markerPosition: {
				lat: lat - 0.005,
				lng: lng + 0.00
			}
		});
	}
	
	moveMarkerEast() {
		const { lat, lng } = this.state.markerPosition;
		this.setState({
			markerPosition: {
				lat: lat + 0.00,
				lng: lng + 0.005
			}
		});
	}

	moveMarkerWest() {
		const { lat, lng } = this.state.markerPosition;
		this.setState({
			markerPosition: {
				lat: lat + 0.000,
				lng: lng - 0.005
			}
		});
	}



	render() {
		const { markerPosition, startingPosition, polygon } = this.state;
		return (
			<div>
				<Map markerPosition={markerPosition} startingPosition = {startingPosition} polygon={polygon} />
				<div id="quit">
					Current markerPosition: lat: {startingPosition.lat}, lng:{" "}
					{startingPosition.lng}
					<div id="counties">
						Addison, Bennington, Caledonia, Chittenden, Essex, Franklin, Grand
						Isle, Lamoille, Orange, Orleans, Rutland, Washington, Windham,
						Windsor
					</div>
					<div id="latlon">Latitude: {this.state.markerReveal.lat}, Longitude: {this.state.markerReveal.lng} County: {this.state.countyReveal}</div>
				</div>
				<button onClick={this.moveMarkerNorth}>Move marker North</button>
				<button onClick={this.moveMarkerSouth}>Move marker South</button>
				<button onClick={this.moveMarkerEast}>Move marker East</button>
				<button onClick={this.moveMarkerWest}>Move marker West</button>
				<button
					id="Start"
					disabled={this.state.startButton}
					onClick={this.startButton}
				>
					Start Game
				</button>
				<button
					id="Guess"
					disabled={this.state.guessDisabled}
					onClick={this.guessButton}
				>
					Guess
				</button>
				<button
					id="Quit"
					disabled={this.state.quitDisabled}
					onClick={this.quitButton}
				>
					Quit
				</button>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
