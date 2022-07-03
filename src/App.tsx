import React, { useRef, useState } from 'react';
import './App.css';
// import { getMockRoute } from './mock';
import { BaseBuilder } from 'gpx-builder';
import Map from './components/Map';
import { Waypoint } from './common/interfaces';
import { Grid, Typography } from '@mui/material';
import { LngLat } from 'mapbox-gl';
import WaypointList from './components/WaypointList';

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const waypointsRef = useRef<Waypoint[]>(waypoints)

  const addWaypoint = (coordinates: LngLat) => {
    const newWaypoint: Waypoint = {
      id: String(Date.now()),
      name: `Waypoint ${waypointsRef.current.length + 1}`,
      index: waypointsRef.current.length,
      coordinates: [coordinates.lng, coordinates.lat]
    }

    waypointsRef.current = [...waypointsRef.current, newWaypoint]
    setWaypoints(waypointsRef.current)
  }

  const removeWaypoint = (waypointIndex: number) => {
    waypointsRef.current = waypointsRef.current.filter((waypoint) => waypoint.index !== waypointIndex)
    waypointsRef.current = waypointsRef.current.map((waypoint, i) => ({ ...waypoint, index: i, name: `Waypoint ${i + 1}` }))
    setWaypoints(waypointsRef.current)
  }

  const orderWaypoints = (newList: Waypoint[]) => {
    waypointsRef.current = newList;
    setWaypoints(newList)
  }

  const moveWaypoint = (movedWaypoint: Waypoint) => {
    waypointsRef.current = waypointsRef.current.map((waypoint) => waypoint.id === movedWaypoint.id ? ({
      ...waypoint,
      coordinates: movedWaypoint.coordinates
    }): waypoint)

    setWaypoints(waypointsRef.current)
  }

  const downloadRoute = () => {
    const { Point } = BaseBuilder.MODELS
    const gpxBuilder = new BaseBuilder()


    const gpxWaypoints = waypoints.map((waypoint) => new Point(
      waypoint.coordinates[1],
      waypoint.coordinates[0],
      { name: waypoint.name}
    ))

    gpxBuilder
      .setWayPoints(gpxWaypoints)

    const gpxData = gpxBuilder.toObject()

    console.log('GPX data:', gpxData)

    if (!gpxData || !gpxData.attributes || !gpxData.wpt) return

    const xml = 
    `<?xml version="1.0" encoding="UTF-8"?>
<gpx ${Object.keys(gpxData.attributes).map(attributeKey => `${attributeKey}="${gpxData.attributes![attributeKey]}"`).join(' ')}>
  ${gpxData.wpt.map(waypoint => (
  `<wpt lat="${waypoint.attributes.lat}" lon="${waypoint.attributes.lon}">
    <name>${waypoint.name}</name>
  </wpt>`)).join('\n    ')}
  <trk>
    <trkseg>
      ${gpxData.wpt.map(waypoint => (`<trkpt lat="${waypoint.attributes.lat}" lon="${waypoint.attributes.lon}"></trkpt>`)).join('\n         ')}
    </trkseg>
  </trk>
</gpx>`

    console.log(xml)

    const element = document.createElement('a');
    const filename = 'test.gpx'
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <Grid container style={{
      color: '#fff',
      backgroundColor: '#383838',
      height: '100vh',
      width: '100%'
    }}>
      <Grid item sm={4} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-between',
          height: '100%'
        }}
      >
        <div style={{
          padding: 8
        }}>
          <h1>Route Builder</h1>
          <Typography variant="caption">Double-click a point on the map to add a waypoint.</Typography>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
        <WaypointList 
          waypoints={waypoints} 
          onRemoveWaypoint={removeWaypoint} 
          onOrderWaypoints={orderWaypoints}
        />
        </div>
        <div style={{
          width: '100%',
        }}>
          <button 
            style={{ 
              display: 'block',
              width: '90%',
              height: '42px',
              margin: '16px auto',
              borderRadius: 6,
              backgroundColor: '#C3E452',
              border: 'none',
              cursor: 'pointer',
            }}
            disabled={!waypoints.length}
            onClick={downloadRoute}
          >
            <Typography><b>Download your route</b></Typography>
          </button>
        </div>
      </Grid>
      <Grid style={{
        width: '100%',
        height: '100%'
      }} item sm={8}>
        <Map 
          waypoints={waypointsRef.current} 
          onAddWaypoint={addWaypoint}
          onMoveWaypoint={moveWaypoint} 
        />
      </Grid>
    </Grid>
  );
}

export default App;
