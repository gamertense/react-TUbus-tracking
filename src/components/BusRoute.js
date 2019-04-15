import React, { useState } from "react";
import { get } from 'lodash'
import Control from 'react-leaflet-control';
import { Polyline } from 'react-leaflet'

const busline = require('../assets/bus.json');

function BusRoute() {
    const [route, setRoute] = useState([]);
    const [routeColor, setRouteColor] = useState('#5DBCD2');

    const selectBus = line => {
        // switch (line) {
        //     case '2':
        //         setBusRoute(get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude]));
        //         break;
        //     default:
        //         console.log('Default case');
        // }
        setRoute(get(busline, ['line', line, 'loc']).map(loc => [loc.latitude, loc.longitude]));
        setRouteColor(get(busline, ['line', line, 'color']));
    }

    return (
        <div>
            <Control position="bottomleft" >
                <button onClick={() => selectBus('1A')}>1A</button>
                <button onClick={() => selectBus('1B')}>1B</button>
                <button onClick={() => selectBus('2')}>2</button>
                <button onClick={() => selectBus('3')}>3</button>
                <button onClick={() => selectBus('4')}>4</button>
            </Control>
            <Polyline positions={route} color={routeColor} weight={5} />
        </div>
    )
}

export default BusRoute;