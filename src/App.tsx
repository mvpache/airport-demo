import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

// Phase 1
// Need MatUI input for search
// need api integration for getting aiport location

// Phase 2
// second input for second aiport
// calculate distance between the two geocodes of the aiports

// Phase 3
// mobile friendly + styling

class App extends React.Component {
  state = {
    apiRes: null,
    accessToken: null
  }

  getAccessToken(): Promise<void> {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret =  process.env.REACT_APP_CLIENT_SECRET;

   return axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
      ).then((res: any) => {
        const token = res?.data?.access_token;
        this.setState({ accessToken: token});
      }).catch((res: any) => console.log(res))
  }

  getData(): void {
    axios.get('https://test.api.amadeus.com/v1/reference-data/locations/CMUC', { headers: {
      'Authorization': `Bearer ${this.state.accessToken}`
  }}).then((res: any) => console.log(res)).catch((res: any) => console.log(res))
  }


  componentDidMount() {
    this.getAccessToken();
    // this.getData();
   
  //https://test.api.amadeus.com/v1/reference-data/locations/CMUC
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            { this.state.accessToken}
          </a>
        </header>
      </div>
    );
  }

}

export default App;
