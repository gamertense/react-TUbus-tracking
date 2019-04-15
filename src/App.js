import React, { useState, useEffect } from "react";
import { get } from 'lodash'
import moment from "moment";

// core Leaflet component
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './App.css';

import io from 'socket.io-client';
const socket = io('https://service.mappico.co.th');
socket.emit('room', 'THAMMASAT');

L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

const busline = require('./assets/bus.json');
const position = [14.07216624, 100.60579777];
const bus2 = get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude]);

function BusMarker({ idx, marker }) {
  const busMapping = require('./assets/busLineMatching.json')
  const busIconNumber = get(busMapping, marker.carno);

  const icon = L.icon({
    iconUrl: require(`./assets/icon/bus-line-${busIconNumber}.png`),
    popupAnchor: [10, -44],
    iconSize: [25, 28],
    shadowUrl: './assets/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [20, 92],
  });
  const lat = marker.lat;
  const lon = marker.lon;

  return (
    <Marker key={idx} icon={icon} position={{ lat, lon }}>
      <Popup>{marker.driver}</Popup>
    </Marker>
  );
}

function App() {
  const [userLocation, setUserLocation] = useState(position);
  const [busIds, setBusIds] = useState([]);
  const [markers, setMarkers] = useState([
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
    },
    {
      id: "228LE2018000777",
      lat: 14.07056358,
      lon: 100.60161352,
      timestamp: "2019-04-09T10:31:11.000Z",
      acctime: "2019-04-09T10:27:52.000Z",
      speed: 13.895999999999999,
      direction: 358,
      carno: "0TU0017",
      icn: "bus_line2.png",
      carstatus: "online",
      company: "THAMMASAT",
      driver: "Mr Aod Amornpak",
      satellite: 11
    }
  ]);

  useEffect(() => {
    // let item = {
    //   id: "228LE2018000993",
    //   lat: 14.07023055,
    //   lon: 100.61050773,
    //   timestamp: "2019-04-09T10:31:11.000Z",
    //   acctime: "2019-04-09T10:27:52.000Z",
    //   speed: 13.895999999999999,
    //   direction: 358,
    //   carno: "0TU0017",
    //   icn: "bus_line2.png",
    //   carstatus: "online",
    //   company: "THAMMASAT",
    //   driver: "Mr Aod Amornpak",
    //   satellite: 11
    // };

    // let busIndex = busIds.indexOf(item.id);
    // if (busIndex === -1)
    //   setMarkers([item])
    // else {
    //   const newMarkers = [...markers];
    //   newMarkers.splice(busIndex, 1); //Delete
    //   newMarkers.splice(busIndex, 0, item); //Insert
    //   setMarkers(newMarkers)
    // }
  }, [])

  return (
    <div>
      <Map center={position} zoom={17}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={bus2} color={'#5DBCD2'} weight={5} />
        {markers.map((marker, index) => (
          <BusMarker
            key={index}
            idx={index}
            marker={marker}
          />
        ))}
        <Marker position={userLocation}>
          <Popup>
            You're here
          </Popup>
        </Marker>
      </Map>
    </div>
  );
}

export default App;
