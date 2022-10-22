import React from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { debounce } from 'lodash';
import { Airport } from '../../models/airport';
import AirportItem from '../Airport-Item/Airport-Item';
import './Airport-Selector.css';

interface IProps {
  setAirport: (airport: Airport) => void;
  accessToken?: string;
}

interface IState {
  airportInput: string;
  airportList: Airport[];
}

class AirportSelector extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { airportInput: '', airportList: [] };
  }

  handleAirportInputChange = (event: any): void => {
    this.setState({ airportInput: event.target.value });
    this.debouncedAirportSearch();
  };

  searchAirports = (): void => {
    axios
      .get('https://test.api.amadeus.com/v1/reference-data/locations', {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
        params: {
          subType: 'AIRPORT',
          keyword: this.state.airportInput,
          'page[limit]': '10',
          'page[offset]': '0',
          sort: 'analytics.travelers.score',
          view: 'FULL',
          countryCode: 'US',
        },
      })
      .then((res: any) => {
        const airportList = res?.data?.data;
        this.setState({ airportList });
      })
      .catch((res: any) => console.log(res));
  };

  // TODO Load loadash debounce type
  debouncedAirportSearch = debounce(() => this.searchAirports(), 500);

  selectAirport = (airport: Airport): void => {
    this.props.setAirport(airport);
  };

  render() {
    return (
      <div className="Airport-Selector">
        <div className="Search-Container">
          <TextField
            label="Search Airports"
            variant="filled"
            value={this.state.airportInput}
            onChange={this.handleAirportInputChange}
          />
        </div>
        <div className="Airport-List">
          {this.state.airportList.map((airport, index) => {
            return (
              <AirportItem
                key={index}
                isSelectable={true}
                airport={airport}
                selectAirport={this.selectAirport}
              ></AirportItem>
            );
          })}
        </div>
      </div>
    );
  }
}
export default AirportSelector;
