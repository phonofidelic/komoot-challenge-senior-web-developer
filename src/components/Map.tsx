import React, { createRef, useEffect, useRef, forwardRef } from 'react'
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { Route } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  route: Route;
}

// function Marker() {

//   return (
//     <div>marker</div>
//   )
// }
const Marker = forwardRef<HTMLDivElement>((props, ref) => (<div ref={ref}>marker</div>))

export default function Map({ route }: MapProps) {
  const mapContainer = useRef(null)
  const waypointRefs = useRef([])

  useEffect(() => {
    if (!mapContainer.current) return;

    /**
     * Mapbox initialization
     */
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/phonofidelic/ckn2dzfo22ys217n4be9x5l3e',
      zoom: 12,
      attributionControl: false,
    });

    /**
     * Get current location and possition the map
     */
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('position:', pos);

        map.setCenter([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => {
        console.error('Could not get position:', err);
      }
    );

    map.on('load', () => {
      for (const [i, waypoint] of route.waypoints.entries()) {

        const markerEl = document.createElement('div')
        markerEl.className = 'marker'
        markerEl.innerHTML = String(waypoint.index + 1)

        new mapboxgl.Marker(markerEl)
          .setLngLat(waypoint.coordinates)
          .addTo(map)
      }
    })

    return () => map.remove();
  }, [])
  return (
    <>
      <div ref={mapContainer} id="map-container" className="map-container" style={{
        border: '1px solid cyan',
        boxSizing: 'border-box',
        width: '75%',
        height: '100%'
      }} />
      { }
    </>
  )
}