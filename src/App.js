import React, { useState, useEffect } from "react";
import { get } from 'lodash'

import './App.css';

// core Leaflet component
import { Map, Marker, Tooltip, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import ControlBtn from './components/BusRoute/BusRoute'

//Socket.io
import io from 'socket.io-client';

//Set image path for Leaflet
L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

const position = [14.07216624, 100.60579777];

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
      <Tooltip> busNo: {marker.carno}  <br /> status: {marker.carstatus} <br /> speed: {marker.speed}  </Tooltip>
    </Marker>
  );
}

function App() {
  const [userLocation] = useState(position);
  const [busIds, setBusIds] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const socket = io('https://service.mappico.co.th');
    socket.emit('room', 'THAMMASAT');
    socket.on('TU-NGV', data => {
      // console.log(data)
      let busIndex = busIds.indexOf(data.id);
      if (busIndex === -1) {
        setMarkers([...markers, data]);
        setBusIds([...busIds, data.id]);
      }
      else if (markers[busIndex].lat !== data.lat && markers[busIndex].lon !== data.lon) {
        let newMarkers = [...markers];
        newMarkers.splice(busIndex, 1); //Delete
        newMarkers.splice(busIndex, 0, data); //Insert
        setMarkers(newMarkers)
      }
    });
    return () => socket.close();
  }, [busIds, markers])
  // console.log(busIds);

  return (
    <div>
      <Map center={position} zoom={17}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ControlBtn />
        {markers.map((marker, index) => (
          <BusMarker
            key={index}
            idx={index}
            marker={marker}
          />
        ))}
        <Marker position={userLocation}>
          <Tooltip sticky>You are here</Tooltip>
        </Marker>
      </Map>
    </div>
  );
}

export default App;
