import React, { useRef } from 'react';
import './App.css';
// import { getMockRoute } from './mock';
import Map from './components/Map';
import { Route, Waypoint } from './common/interfaces';
import { Grid } from '@mui/material';
import { LngLat } from 'mapbox-gl';



function App() {
  const route = useRef<Route>({ waypoints: [] })

  const addWaypoint = (coordinates: LngLat): Route | undefined => {
    if (!route.current) return

    const newWaypoint: Waypoint = {
      name: `Waypoint ${route.current.waypoints.length + 1}`,
      index: route.current.waypoints.length,
      coordinates: [coordinates.lng, coordinates.lat]
    }

    route.current = {
      ...route.current,
      waypoints: [...route.current.waypoints, newWaypoint]
    }

    return route.current
  }

  return (
    <Grid container style={{
      color: '#fff',
      backgroundColor: '#383838',
      height: '100vh',
      width: '100%'
    }}>
      <Grid item sm={4}>SideBar</Grid>
      <Grid style={{
        width: '100%',
        height: '100%'
      }} item sm={8}>
        <Map onAddWaypoint={addWaypoint} />
      </Grid>
    </Grid>
  );
}

export default App;
