import React, { useRef, useState } from 'react';
import './App.css';
// import { getMockRoute } from './mock';
import Map from './components/Map';
import { Waypoint } from './common/interfaces';
import { Grid, Typography } from '@mui/material';
import { LngLat } from 'mapbox-gl';
import WaypointList from './components/WaypointList';



function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const waypointsRef = useRef<Waypoint[]>(waypoints)

  const addWaypoint = (coordinates: LngLat, waypoints: Waypoint[]) => {
    const newWaypoint: Waypoint = {
      name: `Waypoint ${waypointsRef.current.length + 1}`,
      index: waypointsRef.current.length,
      coordinates: [coordinates.lng, coordinates.lat]
    }

    waypointsRef.current = [...waypointsRef.current, newWaypoint]
    setWaypoints(waypointsRef.current)
  }


  return (
    <Grid container style={{
      color: '#fff',
      backgroundColor: '#383838',
      height: '100vh',
      width: '100%'
    }}>
      <Grid item sm={4}>
        <div style={{
          padding: 8
        }}>
          <h1>Route Builder</h1>
          <Typography>Double-click a point on the map to add a waypoint.</Typography>
        </div>
        <WaypointList waypoints={waypoints} />
      </Grid>
      <Grid style={{
        width: '100%',
        height: '100%'
      }} item sm={8}>
        <Map waypoints={waypoints} onAddWaypoint={addWaypoint} />
      </Grid>
    </Grid>
  );
}

export default App;
