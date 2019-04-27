import { mount, route } from 'navi'
import React, { Suspense } from 'react'
import { Router, View } from 'react-navi'

import Map from './components/BusMap/BusMap'

const routes =
  mount({
    '/': route(async req => {
      const { origin, dest } = req.params

      return ({
        title: "TU Real-time Bus Tracking",
        view: <Map origin={origin} dest={dest} />,
      })
    }),
  })

function App() {
  return (
    <Router routes={routes}>
      <Suspense fallback={null}>
        <View />
      </Suspense>
    </Router>
  );
}

export default App;
