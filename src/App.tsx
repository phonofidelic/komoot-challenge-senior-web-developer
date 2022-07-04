import React, { useRef, useState } from 'react';
import './App.css';
// import { getMockRoute } from './mock';
import { BaseBuilder } from 'gpx-builder';
import Map from './components/Map';
import { Waypoint } from './common/interfaces';
import { Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import { LngLat } from 'mapbox-gl';
import WaypointList from './components/WaypointList';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { downloadRoute } from './utils';
import DownloadButton from './components/DownloadButton';

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [listOpen, setListOpen] = useState(true)
  const waypointsRef = useRef<Waypoint[]>(waypoints)
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const handleRouteDownload = () => {
    downloadRoute(waypoints)
  }

  const toggleMobileList = () => {
    setListOpen(!listOpen)
  }

  return (
    <Grid container style={{
      color: '#fff',
      backgroundColor: '#383838',
      height: !isMobile ? '100vh' : 'unset',
      width: '100%'
    }}>
      <Grid item sm={4} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-between',
          width: '100%',
          height: '100%',
          zIndex: 1001,
          backgroundColor: '#383838'
        }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ 
              marginBottom: 16,
              borderBottom: '4px solid #747474'
            }}>
          <h1>Route Builder</h1>
          </div>
          
        </div>
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto',
            maxHeight: isMobile ? (listOpen ? '200px' : 0) : '100%', 
            transition: 'max-height .4s',
          }}
        >
          { waypoints.length < 1 ? (
            <div style={{ padding: 16 }}>
              <Typography variant="caption">Double-click a point on the map to add a waypoint.</Typography>
            </div>
          ) : (
            <WaypointList 
              waypoints={waypoints} 
              onRemoveWaypoint={removeWaypoint} 
              onOrderWaypoints={orderWaypoints}
            />
          )}
        </div>
        { isMobile && waypoints.length > 0 && (
          <div
            style={{
              textAlign: 'center',
            }}  
          >
            <IconButton onClick={toggleMobileList}>
              {listOpen ? <ExpandLess style={{ color: '#fff'}} /> : <ExpandMore style={{ color: '#fff'}} />}
            </IconButton>
          </div>
        )}
        {!isMobile &&
          <div style={{
            width: '100%',
          }}>
            <DownloadButton disabled={waypoints.length > 0} onDownload={handleRouteDownload} />
          </div>
        }
      </Grid>
      <Grid style={{
        width: '100%',
        height: isMobile ? '100vh': '100vh',
        position: isMobile ? 'fixed': 'inherit',
        bottom: 0
      }} item sm={8}>
        <Map 
          waypoints={waypointsRef.current} 
          onAddWaypoint={addWaypoint}
          onMoveWaypoint={moveWaypoint} 
        />
        { isMobile && waypoints.length > 0 && 
          <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: '#383838'
          }}>
          <DownloadButton disabled={waypoints.length > 0} onDownload={handleRouteDownload} />
        </div>
      }
      </Grid>
    </Grid>
  );
}

export default App;
