import React, { useRef, useState } from 'react';
import './App.css';
import styled from 'styled-components'
// import { getMockRoute } from './mock';
import Map from './components/Map';
import { Waypoint } from './common/interfaces';
import { Grid } from '@mui/material';
import { LngLat } from 'mapbox-gl';
import WaypointList from './components/WaypointList';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { downloadRoute } from './utils';
import DownloadButton from './components/DownloadButton';

const Container = styled(Grid)`
  color: #fff;
  background-color: #383838;
  height: 100vh;
  width: 100%;
  @media (max-width: 600px) {
    height: unset;
  }
`
const SideBarContainer = styled(Grid)`
  display: flex;
  flex-direction: column!important;
  align-content: space-between;
  width: 100%;
  height: 100%;
  z-index: 1001;
  background-color: #383838;
`
const HeaderContainer = styled.div`
  padding: 0 16px;
  & > div {
    margin-bottom: 16px;
    border-bottom: 4px solid #747474;
  }
`
const WaypointListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 100%;
  transition: max-height .4s ease-in-out;
  @media (max-width: 600px) {
    max-height: ${(props: { listOpen: boolean }) => props.listOpen ? '200px' : '0px'};
  }
`
const MenuToggleButton = styled.button`
  display: none;
  @media (max-width: 600px) {
    display: block;
    text-align: center;
    width: 100%;
    background-color: #383838;
    border: none;
  }
`
const DownloadButtonContainer = styled.div`
  width: 100%;
  background-color: #383838;
  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
    display: ${(props: {hide?: boolean}) => props.hide ? 'none' : 'block'};
  }
`
const MapContainer = styled(Grid)`
  width: 100%;
  height: 100vh;
  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
  }
`

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [listOpen, setListOpen] = useState(true)
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

  const handleRouteDownload = () => {
    downloadRoute(waypoints)
  }

  const toggleMobileList = () => {
    setListOpen(!listOpen)
  }

  return (
    <Container container>
      <SideBarContainer item sm={4}>
        <HeaderContainer>
          <div>
            <h1>Route Builder</h1>
          </div>
        </HeaderContainer>
        <WaypointListContainer listOpen={listOpen}>
          <WaypointList 
            waypoints={waypoints} 
            onRemoveWaypoint={removeWaypoint} 
            onOrderWaypoints={orderWaypoints}
          />
        </WaypointListContainer>
        { waypoints.length > 0 &&
          <MenuToggleButton onClick={toggleMobileList}>
            {listOpen ? <ExpandLess style={{ color: '#fff'}} /> : <ExpandMore style={{ color: '#fff'}} />}
          </MenuToggleButton>
        }
        <DownloadButtonContainer hide={waypoints.length < 1}>
          <DownloadButton disabled={waypoints.length < 1} onDownload={handleRouteDownload} />
        </DownloadButtonContainer>
      </SideBarContainer>      
      <MapContainer item sm={8}>
        <Map 
          waypoints={waypointsRef.current} 
          onAddWaypoint={addWaypoint}
          onMoveWaypoint={moveWaypoint} 
        />
      </MapContainer>
    </Container>
  );
}

export default App;
