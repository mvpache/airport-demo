import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import './App.css';
import AirportSelector from './components/Airport-Selector/Airport-Selector';
import { Airport } from './models/airport';
import AirportItem from './components/Airport-Item/Airport-Item';
import { GeoCode } from './models/geo-code';
import { loadMapApi } from './utils/GoogleMapsUtils';

// Phase 3
// mobile friendly + styling

const metersPerNautMile = 1852;
type GoogleLatLng = google.maps.LatLngLiteral;

interface IProps {}

interface IState {
  accessToken?: string;
  departingAirport?: Airport;
  arrivingAirport?: Airport;
  flightDistance?: number;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    loadMapApi();
    this.getAccessToken();
  }

  getAccessToken = (): Promise<void> => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

    return axios
      .post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((res: any) => {
        const token = res?.data?.access_token;
        this.setState({ accessToken: token });
      })
      .catch((res: any) => console.log(res));
  };

  setDepartingAirport = (departingAirport: Airport): void => {
    this.setState({ departingAirport });
  };

  setArrivingAirport = (arrivingAirport: Airport): void => {
    this.setState({ arrivingAirport });
  };

  getDistance = (): void => {
    const convertGeoCodeToLatLngLiteral = (code: GeoCode): GoogleLatLng => {
      return { lat: code.latitude, lng: code.longitude };
    };

    if (this.state.arrivingAirport && this.state.departingAirport) {
      const arrivingCoordinates = convertGeoCodeToLatLngLiteral(
        this.state.arrivingAirport.geoCode
      );

      const departingCoordinates = convertGeoCodeToLatLngLiteral(
        this.state.departingAirport.geoCode
      );

      const distanceInMeters =
        google.maps.geometry.spherical.computeDistanceBetween(
          departingCoordinates,
          arrivingCoordinates
        );

      const distanceInMiles = distanceInMeters / metersPerNautMile;
      this.setState({ flightDistance: Math.round(distanceInMiles) });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="Airport-Contaner">
          <h2>Departing Airport</h2>
          {this.state.departingAirport ? (
            <AirportItem
              isSelectable={false}
              airport={this.state.departingAirport}
            ></AirportItem>
          ) : (
            <AirportSelector
              setAirport={this.setDepartingAirport}
              accessToken={this.state.accessToken}
            ></AirportSelector>
          )}
        </div>
        <div className="Airport-Contaner">
          <h2>Arriving Airport</h2>
          {this.state.arrivingAirport ? (
            <AirportItem
              isSelectable={false}
              airport={this.state.arrivingAirport}
            ></AirportItem>
          ) : (
            <AirportSelector
              setAirport={this.setArrivingAirport}
              accessToken={this.state.accessToken}
            ></AirportSelector>
          )}
        </div>
        <Button variant="contained" onClick={() => this.getDistance()}>
          Get Distance
        </Button>
        {this.state.flightDistance &&
          `You'll fly about ${this.state.flightDistance} miles on this trip!`}
      </div>
    );
  }
}

export default App;
