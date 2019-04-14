import React, { Component } from 'react';
import { get } from 'lodash'
import moment from "moment";
import update from 'immutability-helper';

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

const busline = require('./assets/bus.json')
const position = [14.07216624, 100.60579777]
const bus2 = get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude])

class App extends Component {
  state = {
    markerPos: [14.07412792, 100.60161889],
    userLocation: position,
    markers: {
      id: ['228LE2018000993'],
      data: [
        {
          id: "228LE2018000993",
          lat: 14.0695,
          lon: 100.60423,
          timestamp: "2019-04-09T10:31:11.000Z",
          acctime: "2019-04-09T10:27:52.000Z",
          speed: 13.895999999999999,
          direction: 358,
          carno: "0TU0019",
          icn: "bus_line2.png",
          carstatus: "online",
          company: "THAMMASAT",
          driver: "Mr Aod Amornpak",
          satellite: 11
        }
      ]
    },
  }

  componentWillMount() {
    // Handle bus tracking event
    // socket.on('TU-NGV', data => {
    //   console.log(data)
    //   if (get(data, 'carno') === "0TU0012")
    //     this.setState({ markerPos: [get(data, 'lat'), get(data, 'lon')] })
    // });
    let item = {
      id: "228LE2018000993",
      lat: 14.07217665,
      lon: 100.60621619,
      timestamp: "2019-04-09T10:31:11.000Z",
      acctime: "2019-04-09T10:27:52.000Z",
      speed: 13.895999999999999,
      direction: 358,
      carno: "0TU0017",
      icn: "truck",
      carstatus: "online",
      company: "THAMMASAT",
      driver: "Mr Aod Amornpak",
      satellite: 11
    };

    const itemid = item.id
    let mkindex = this.state.markers.id.indexOf(itemid);
    if (mkindex === -1) {
      item.icn = 'bus_line2.png';
      const newMarkerId = update(this.state.markers.id, { $push: [itemid] })
      const newMarkerData = update(this.state.markers.data, { $push: [item] })
      this.setState({ markers: { id: newMarkerId, data: newMarkerData } });
    } else {
      item.icn = "bus_line2.png";
      const data = this.state.markers.data;
      const newData = update(data, {
        $splice: [[mkindex, 1, item]]
      });
      this.setState({ markers: { data: newData } });
    }
  }

  render() {
    let markers;
    if (this.state.markers.data.length > 0) {
      markers = this.state.markers.data.map((item, idx) => {
        const icon = L.icon({
          iconUrl: require(`./assets/icon/${item.icn}`),
          popupAnchor: [10, -44],
          iconSize: [25, 28],
          shadowUrl: './assets/marker-shadow.png',
          shadowSize: [68, 95],
          shadowAnchor: [20, 92],
        });
        const lat = item.lat;
        const lon = item.lon;

        return (
          <Marker key={idx} icon={icon} position={{ lat, lon }}>
            <Popup>{item.title}</Popup>
          </Marker>
        );
      })
    }

    return (
      <div>
        <Map center={position} zoom={17}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={bus2} color={'#5DBCD2'} weight={5} />
          {markers}
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
