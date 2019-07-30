import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map";
import leafletPip from "leaflet-pip";
import L from "leaflet";
import borderData from "./border";
import counties from "./counties";
import vermontMap from "./vermont-county-map.gif";
import { ReactComponent as LocateButton} from "./assets/map-pin.svg"
import { ReactComponent as LeftArrow} from "./assets/arrow-left.svg"
import { ReactComponent as RightArrow} from "./assets/arrow-right.svg"
import { ReactComponent as DownArrow} from "./assets/arrow-down.svg"
import { ReactComponent as UpArrow} from "./assets/arrow-up.svg"
import { NONAME } from "dns";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			message: "react is cool...",
			date: null,
			input: "", 
			startButton: false,
			guessDisabled: true,
			quitDisabled: true,
			returnDisabled: true,
			startingPosition: { lat: 44.4759, lng: -73.2121 },
			markerPosition: { lat: 44.4759, lng: -73.2121 },
			markerReveal: {lat: null, lng: null},
			countyReveal: null,
			currentScore: {score: 1000},
			polygon: L.geoJSON(borderData),
			counties: L.geoJSON(counties),
			confirmation: true,
			isGuessCorrect: false,
			latLonStyle: "none", 
			currentPlayer: ""
		};
		this.moveMarkerNorth = this.moveMarkerNorth.bind(this);
		this.moveMarkerSouth = this.moveMarkerSouth.bind(this);
		this.moveMarkerEast = this.moveMarkerEast.bind(this);
		this.moveMarkerWest = this.moveMarkerWest.bind(this);
		this.startButton = this.startButton.bind(this);
		this.guessButton = this.guessButton.bind(this);
		this.quitButton = this.quitButton.bind(this);
		this.checkWithin = this.checkWithin.bind(this);
		this.confirmButton = this.confirmButton.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	async componentDidMount() {
		const response = await fetch ('/scores');
		const scoresObj = await response.json();
		console.log('the scores is: ', scoresObj);
		this.setState ({
			scores: scoresObj.scores,
			date: scoresObj.date,
		})
	}

	async handleSubmit(evt){
		this.setState({
			currentPlayer: this.state.input,
		})
		evt.preventDefault();
		const response = await fetch('/scores', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:	JSON.stringify({
				name: this.state.currentPlayer,
				score: this.state.currentScore.score
			})
		});
		const results = await response.text();
		if (results === 'Success') {
			const nextResponse = await fetch('/scores')
			const json = nextResponse.json()
			this.setState({
				score: json.score,
				date: json.date
			});
		}
	}

	handleInputChange(e){
		e.preventDefault();
		this.setState({
			input: e.target.value
		});
	}

	confirmButton(){
		const { score } = this.state.currentScore;
		console.log(document.getElementById("countyselect").value);
		console.log(this.state.countyReveal);
		if (document.getElementById("countyselect").value.toUpperCase() === this.state.countyReveal) {
			console.log("This should work!")
			this.setState({
				isGuessCorrect: true
			});
		}
		if (document.getElementById("countyselect").value.toUpperCase() !== this.state.countyReveal) {
			console.log("This should work!")
			this.setState({
				currentScore: {
					score: score - 50
				}
			});
		}
	}

	checkWithin() {
    let LatLon = this.randomLatLon();
    while(!leafletPip.pointInLayer(LatLon, this.state.polygon).length) {
      LatLon = this.randomLatLon();
    }
    return LatLon; 
  }
  
	randomLatLon() {
		let lat = Math.random() * (45.00541896831666 - 42.730315121762715) + 42.730315121762715;
		let lng = (Math.random() * (71.51022535353107 - 73.35218221090553) + 73.35218221090553) * -1;
		return [lng, lat];
	}

	quitButton() {
		document.getElementById('latlon').style.display = "inline-block";
		let latlon = this.state.startingPosition;
		this.setState({
			quitDisabled: true,
			guessDisabled: true,
			markerReveal: {
				lat: latlon.lat,
				lng: latlon.lng
			}
		});
	}

	startButton() {
		let latlon = this.state.startingPosition;
    let LatLonReturn = this.checkWithin();
		let withinCounties = leafletPip.pointInLayer(LatLonReturn, this.state.counties);
    console.log({LatLonReturn})
		this.setState({
			startButton: true,
			guessDisabled: false,
			quitDisabled: false,
			returnDisabled: false,
			markerPosition: {
				lat: LatLonReturn[1],
				lng: LatLonReturn[0]
			},
			startingPosition: {
				lat: LatLonReturn[1],
				lng: LatLonReturn[0]
			},
			markerReveal: {
				lat: LatLonReturn[1],
				lng: LatLonReturn[1]
			},
			countyReveal: withinCounties[0].feature.properties.CNTYNAME,
		});
	}

	returnButton () {
		
	}

	guessButton() {
		this.setState({
			guessDisabled: true,
			confirmation: false

		});
	}

	moveMarkerNorth() {
		const { lat, lng } = this.state.markerPosition;
		const { score } = this.state.currentScore;
		this.setState({
			markerPosition: {
				lat: lat + 0.001,
				lng: lng + 0.0
			},
			currentScore: {
				score: score - 1
			}
		});
	}

	moveMarkerSouth() {
		const { lat, lng } = this.state.markerPosition;
		const { score } = this.state.currentScore;
		this.setState({
			markerPosition: {
				lat: lat - 0.001,
				lng: lng + 0.00
			},
			currentScore: {
				score: score - 1
			}
		});
	}
	
	moveMarkerEast() {
		const { lat, lng } = this.state.markerPosition;
		const { score } = this.state.currentScore;
		this.setState({
			markerPosition: {
				lat: lat + 0.00,
				lng: lng + 0.001
			},
			currentScore: {
				score: score - 1
			}
		});
	}

	moveMarkerWest() {
		const { lat, lng } = this.state.markerPosition;
		const { score } = this.state.currentScore;
		this.setState({
			markerPosition: {
				lat: lat + 0.000,
				lng: lng - 0.001
			},
			currentScore: {
				score: score - 1
			}
		});
	}

	render() {
		const { markerPosition, startingPosition, polygon } = this.state;
		return (
			<div>
				<h1>{this.state.scores}</h1>
				<h3>{this.state.date}</h3>
				<form onSubmit={this.handleSubmit} method="POST" action="/scores">
					<label htmlFor="scores">Score here:</label><br></br>
					<input onChange={this.handleInputChange} placeholder="write a scores"></input>
					<input type="submit" value="New Scores"></input>
				</form>
				<div id="score">Your Current Score: {this.state.currentScore.score}</div>
				<div id = "mapbox">
					<Map markerPosition={markerPosition} startingPosition = {startingPosition} polygon={polygon} id="gamemap"/>
					<img src = {vermontMap} alt="Vermont Map" id="vermontmap"/>	
				</div>
				<div>
					Current markerPosition: lat: {startingPosition.lat}, lng:{startingPosition.lng}
					<div id="modalbox" style={this.state.confirmation ? {display: "none"} : {display: "block"}}>
						<div id="modalgrid">
							<form action="">
								<select name="counties" id="countyselect">
									<option value="Addison">Addison</option>
									<option value="Bennington">Bennington</option>
									<option value="Caledonia">Caledonia</option>
									<option value="Chittenden">Chittenden</option>
									<option value="Essex">Essex</option>
									<option value="Franklin">Franklin</option>
									<option value="Grand Isle">Grand Isle</option>
									<option value="Lamoille">Lamoille</option>
									<option value="Orange">Orange</option>
									<option value="Orleans">Orleans</option>
									<option value="Rutland">Rutland</option>
									<option value="Washington">Washington</option>
									<option value="Windham">Windham</option>
									<option value="Windsor">Windsor</option>
								</select>
									<br></br>
									<input type="button" id="modalGuess" value="Guess" onClick={this.confirmButton}></input>
									<button id="cancel" onClick={this.quitButton}>
										Cancel
									</button>
							</form>
						</div>
					</div>
					<div id="modalwinbox"> </div>
					<div id="latlon" style={this.state.isGuessCorrect ? {display: "inline-block"} : {display: "none"}}>Latitude: {this.state.markerReveal.lat}, Longitude: {this.state.markerReveal.lng} County: {this.state.countyReveal}</div>
				</div>
				<div id="navbox">
					<div id="navgrid">
						<button className="navbuttons" id="N" onClick={this.moveMarkerNorth}>
							<UpArrow/>
						</button>
						<button className="navbuttons" id="S" onClick={this.moveMarkerSouth}>
							<DownArrow/>
						</button>
						<button className="navbuttons" id="E" onClick={this.moveMarkerEast}>
							<RightArrow/>
						</button>
						<button className="navbuttons" id="W" onClick={this.moveMarkerWest}>
							<LeftArrow/>
						</button>
						<button
							class="navbuttons"
							id="Return"
							disabled={this.state.returnDisabled}
							onClick={this.returnButton} >
							<LocateButton/>
						</button>
					</div>
				</div>
				<button id="Start" 
				disabled={this.state.startButton} 
				onClick={this.startButton}>
					Start Game
				</button>
				<button
					id="Guess"
					disabled={this.state.guessDisabled}
					onClick={this.guessButton}>
					Guess
				</button>
				<button
					id="Return"
					disabled={this.state.returnDisabled}
					onClick={this.returnButton}>
					Return
				</button>
				<button
					id="Quit"
					disabled={this.state.quitDisabled}
					onClick={this.quitButton}>
					I Give Up!
				</button>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;