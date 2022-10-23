import React from 'react';
import Button from '@mui/material/Button';
import { Airport } from '../../models/airport';
import './Airport-Item.css';

interface IProps {
  airport: Airport;
  isSelectable: boolean;
  isRemovable?: boolean;
  selectAirport?: (airport: Airport) => void;
  removeAirport?: () => void;
}

interface IState {}

class AirportItem extends React.Component<IProps, IState> {
  handleAirportSelect = (): void => {
    if (this.props.selectAirport) {
      this.props.selectAirport(this.props.airport);
    }
  };

  handleAirportRemove = (): void => {
    if (this.props.removeAirport) {
      this.props.removeAirport();
    }
  };

  // TODO: These could probably a Mat-Card or something like that?
  render() {
    return (
      <div className="Airport-Item">
        <div className="Airport-Item-Info">
          <div>
            {this.props.airport.name} ({this.props.airport.iataCode})
          </div>
          <div>
            {this.props.airport.address.cityName},
            {this.props.airport.address.stateCode}
          </div>
        </div>
        {this.props.isSelectable && this.props.selectAirport && (
          <Button
            className="Airport-Item-Button"
            variant="contained"
            onClick={() => this.handleAirportSelect()}
          >
            Select Airport
          </Button>
        )}
        {this.props.isRemovable && (
          <Button
            className="Airport-Item-Button"
            variant="contained"
            onClick={() => this.handleAirportRemove()}
          >
            X
          </Button>
        )}
      </div>
    );
  }
}
export default AirportItem;
