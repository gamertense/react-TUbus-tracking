import React, { Component } from 'react';
import {get} from 'lodash'

// core Leaflet component
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './App.css';

L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/'
export const busIcon = new L.Icon({
  iconUrl: require('./assets/bus_line2.png'),
  iconRetinaUrl: require('./assets/bus_line2.png'),
  popupAnchor: [10, -44],
  iconSize: [25, 28],
  shadowUrl: './assets/marker-shadow.png',
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

const axios = require('axios');
const busline = require('./assets/bus.json')
const jsondata = require('./sample_data/20190122_1321.json');
const position = [14.07216624, 100.60579777]

const bus2 = get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude])
console.log(bus2)

class App extends Component {
  state = {
    markerPos: [14.07412792, 100.60161889],
    userLocation: position
  }

  async componentWillMount() {
    try {
      // let index = 0;
      // setInterval(async () => {
      //   if (index < jsondata.data.length) {
      //     this.setState({ markerPos: [jsondata.data[index].lat, jsondata.data[index].lon] })
      //   index++;
      //   console.log('TCL: App -> componentWillMount -> index', index)
      //   }


      //   const apiResponse = await axios.get('http://localhost:3001/')
      //   console.log(apiResponse)
      //   if (apiResponse.status === 200) {
      //     this.setState({ markerPos: [apiResponse.data[0].lat, apiResponse.data[0].lon] })
      //   } 
      // }, 200);

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
          <Polyline positions={bus2} color={'#5DBCD2'} weight={5} />
          <Marker position={this.state.markerPos} icon={busIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
          </Marker>
          <Marker position={this.state.userLocation}>
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
