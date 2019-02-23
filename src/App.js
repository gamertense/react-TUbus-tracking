import React, { Component } from 'react';

// core Leaflet component
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './App.css';

L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/'

const position = [14.0712, 100.6135]
const axios = require('axios');

class App extends Component {
  state = {
    markerPos: [15.0712, 100.6135]
  }

  async componentWillMount() {
    try {
      setInterval(async () => {
        const apiResponse = await axios.get('http://localhost:3000/')
        this.setState({ markerPos: [apiResponse.data[0].lat, apiResponse.data[0].lon] })
        console.log(apiResponse)
      }, 3000);

    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <Map center={position} zoom={17}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={this.state.markerPos}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

export default App;
