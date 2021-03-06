import React, { useState, useEffect, useRef } from "react";
import { get } from 'lodash'

import './BusMap.css';

// core Leaflet component
import { Map, Marker, Tooltip, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import ControlBtn from '../../components/BusRoute/BusRoute'
import RotatedMarker from "./RotatedMarker";
import 'leaflet/dist/leaflet.css'

//Socket.io
import io from 'socket.io-client';

import moment from "moment";
import useGeolocation from 'react-hook-geolocation'

//Set image path for Leaflet
L.Icon.Default.imagePath =
    '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

const position = [14.07216624, 100.60579777];

function DestinationMarker({ destination }) {
    const icon = L.icon({
        iconUrl: require(`../../assets/icon/destination.png`),
        iconSize: [58, 65], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [24, 55], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return (
        <Marker icon={icon} position={destination}>
            <Tooltip sticky>Your destination</Tooltip>
        </Marker>
    );
}

function BusMarker({ idx, marker }) {
    const busMapping = require('../../assets/busLineMatching.json')
    const busIconNumber = get(busMapping, marker.carno);
    console.log(marker.direction)

    const icon = L.icon({
        iconUrl: require(`../../assets/icon/bus-line-${busIconNumber}.png`),
        popupAnchor: [10, -44],
        iconSize: [30, 48],
        shadowUrl: '../../assets/marker-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [20, 92],
    });
    const lat = marker.lat;
    const lon = marker.lon;

    return (
        <RotatedMarker key={idx} icon={icon} position={{ lat, lon }} rotationAngle={marker.direction}>
            <Tooltip> Bus No: {marker.carno}  <br />
                Status: {marker.carstatus} <br />
                Speed: {marker.speed.toFixed(2)} km/hr <br />
                Engine started: {moment(new Date(marker.acctime)).format("YYYY-MM-DD HH:mm")}</Tooltip>
        </RotatedMarker>
    );
}

export default function BusMap(props) {
    const [busIds, setBusIds] = useState([]);
    const [markers, setMarkers] = useState([]);
    const refmarker = useRef(null);

    const geolocation = useGeolocation();
    const [userLocation, setUserLocation] = useState(position);

    const [destination, setDestination] = useState();

    useEffect(() => {
        //If user location is provided, update the user marker.
        if (props.origin !== undefined) {
            const splitted = props.origin.split(',');
            setUserLocation([parseFloat(splitted[0]), parseFloat(splitted[1])]);
        }
        //If destination provided
        if (props.dest !== undefined) {
            const splitted = props.dest.split(',');
            setDestination([parseFloat(splitted[0]), parseFloat(splitted[1])]);
        }

        console.log(props);
    }, [])

    // Update user marker to current user location on Earth.
    useEffect(() => {
        if (geolocation.latitude !== undefined && geolocation.latitude !== null && geolocation.longitude !== undefined && geolocation.longitude !== null)
            setUserLocation([geolocation.latitude, geolocation.longitude]);
    }, [geolocation])


    //Get real-time TU bus tracking
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

    //Update user location on drag end.
    function updateUserLocation() {
        // setTimeout(function () { alert("Hello"); }, 120000); // 2 minutes
        setUserLocation([refmarker.current.leafletElement.getLatLng().lat, refmarker.current.leafletElement.getLatLng().lng])
    }

    return (
        <Map center={position} zoom={17}>
            <TileLayer
                attribution=''
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
            <Marker
                ref={refmarker}
                position={userLocation}
                draggable
                ondragend={updateUserLocation}>
                <Tooltip sticky>You are here</Tooltip>
            </Marker>
            {destination ?
                <DestinationMarker destination={destination} />
                : null
            }
        </Map>
    )
}