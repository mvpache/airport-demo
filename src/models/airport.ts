import { GeoCode } from './geo-code';

export interface Airport {
  name: string;
  iataCode: string;
  geoCode: GeoCode;
  address: {
    cityName: string;
    stateCode: string;
  };
}
