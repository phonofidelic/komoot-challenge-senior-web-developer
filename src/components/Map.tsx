import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import { Route } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  route: Route;
}

export default function Map({ route }: MapProps) {
  const mapContainer = useRef(null)

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
      for (const waypoint of route.waypoints) {

        const markerEl = document.createElement('div')
        markerEl.className = 'marker'
        markerEl.innerHTML = String(waypoint.index + 1)

        new mapboxgl.Marker(markerEl)
          .setLngLat(waypoint.coordinates)
          .addTo(map)
      }

      let routeCoords = []
      for (let i = 0; i < route.waypoints.length - 1; i++) {
        routeCoords.push([route.waypoints[i].coordinates[0], route.waypoints[i].coordinates[1]])
        routeCoords.push([route.waypoints[i + 1].coordinates[0], route.waypoints[i + 1].coordinates[1]])
      }

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoords
          }
        }
      })
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#1086E8',
          'line-width': 8
        }
      })
    })

    return () => map.remove();
  }, [route.waypoints])
  return (
    <>
      <div ref={mapContainer} id="map-container" className="map-container" style={{
        width: '100%',
        height: '100%'
      }} />
      { }
    </>
  )
}