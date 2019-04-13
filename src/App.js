import React, { Component } from 'react';
import { get } from 'lodash'

// core Leaflet component
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './App.css';

import io from 'socket.io-client';
const socket = io('https://service.mappico.co.th');
socket.emit('room', 'THAMMASAT');

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

const busline = require('./assets/bus.json')
const position = [14.07216624, 100.60579777]
const bus2 = get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude])

class App extends Component {
  state = {
    markerPos: [14.07412792, 100.60161889],
    userLocation: position
  }

  componentWillMount() {
    // Handle bus tracking event
    socket.on('TU-NGV', data => {
      console.log(data)
      if (get(data, 'carno') === "0TU0012")
        this.setState({ markerPos: [get(data, 'lat'), get(data, 'lon')] })
    });
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
