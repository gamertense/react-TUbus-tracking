import React, { Component } from 'react';

// core Leaflet component
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './App.css';

L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/'
export const busIcon = new L.Icon({
  iconUrl: require('./assets/bus_line2.png'),
  iconRetinaUrl: require('./assets/bus_line2.png'),
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 28],
  shadowUrl: './assets/marker-shadow.png',
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

const jsondata = require('./sample_data/20190121-1900.json');

const position = [14.0712, 100.6135]
const axios = require('axios');

class App extends Component {
  state = {
    markerPos: [15.0712, 100.6135]
  }

  async componentWillMount() {
    try {
      let index = 0;
      setInterval(async () => {
        this.setState({ markerPos: [jsondata.data[index].lat, jsondata.data[index].lon] })
        index++;
        console.log('TCL: App -> componentWillMount -> index', index)

        // const apiResponse = await axios.get('http://localhost:3001/')
        // console.log(apiResponse)
        // if (apiResponse.status === 200) {
        //   this.setState({ markerPos: [apiResponse.data[0].lat, apiResponse.data[0].lon] })
        // } 
      }, 2000);

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
          <Marker position={this.state.markerPos} icon={busIcon}>
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
