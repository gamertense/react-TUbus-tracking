import React, { useState } from "react";
import { get } from 'lodash'
import Control from 'react-leaflet-control';
import { Polyline } from 'react-leaflet'

const busline = require('../assets/bus.json');

const allRoutes = [
    { path: get(busline, ['line', '1A', 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', '1A', 'color']) },
    { path: get(busline, ['line', '1B', 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', '1B', 'color']) },
    { path: get(busline, ['line', '2', 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', '2', 'color']) },
    { path: get(busline, ['line', '3', 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', '3', 'color']) },
    { path: get(busline, ['line', '4', 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', '4', 'color']) }
]

function BusRoute() {
    const [routes, setRoutes] = useState(allRoutes);
    const [lines, setLines] = useState(['1A', '1B', '2', '3', '4']);

    const selectBus = line => {
        const lineIndex = lines.indexOf(line);
        if (lineIndex === -1) {
            // Push new route and line
            const newRoute = [...routes, { path: get(busline, ['line', line, 'loc']).map(loc => [loc.latitude, loc.longitude]), color: get(busline, ['line', line, 'color']) }];
            const newLine = [...lines, line];
            setRoutes(newRoute);
            setLines(newLine);
        } else {
            //Remove from routes and lines
            const newRoute = [...routes];
            const newLine = [...lines];
            newRoute.splice(lineIndex, 1);
            newLine.splice(lineIndex, 1);
            setRoutes(newRoute)
            setLines(newLine);
        }
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
            {routes.map((route, index) =>
                <Polyline key={index} positions={route.path} color={route.color} weight={5} />
            )}
        </div>
    )
}

export default BusRoute;