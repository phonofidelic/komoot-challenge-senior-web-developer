import React, { useEffect, useRef } from 'react'
import mapboxgl, { LngLat, Map as _Map, MapMouseEvent } from 'mapbox-gl';
import { Waypoint } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  waypoints: Waypoint[]
  onAddWaypoint(coortinagtes: LngLat, waypoints: Waypoint[]): void
}

export default function Map({ waypoints, onAddWaypoint }: MapProps) {
  const mapContainer = useRef(null)
  const mapRef = useRef<_Map | null>(null)

  const handleDblClick = (event: MapMouseEvent) => {
    event.preventDefault()
    console.log('handleDblClick:', event.lngLat)
    onAddWaypoint(event.lngLat, waypoints)
  }

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapRef.current === null) return

    /**
     * Mapbox initialization
     */
    mapRef.current = new mapboxgl.Map({
      //@ts-ignore
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
        if (!mapRef.current) return;
        console.log('Getting pos...')

        mapRef.current.setCenter([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => {
        console.error('Could not get position:', err);
      }
    );

    /**
     * Register map interaction events
     */
    mapRef.current.on('dblclick', handleDblClick)

    return () => {
      if (!mapRef.current) return;
      mapRef.current.remove()
    };
  }, [])

  useEffect(() => {
    if (!mapRef.current) return;

    for (const waypoint of waypoints) {
      console.log('useEffect 2, waypoints:', waypoints)
      const markerEl = document.createElement('div')
      markerEl.className = 'marker'
      markerEl.innerHTML = String(waypoint.index + 1)

      new mapboxgl.Marker(markerEl)
        .setLngLat(waypoint.coordinates)
        .addTo(mapRef.current)

      if (waypoint.index > 0 && mapRef.current !== null) {
        const timestamp = Date.now()
        console.log('*** waypoints:', waypoints)
        mapRef.current.addSource(`route_${waypoint.index}_${timestamp}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                waypoints[waypoint.index - 1].coordinates,
                waypoint.coordinates,
              ]
            }
          }
        })
        mapRef.current.addLayer({
          id: `route_${waypoint.index}_${timestamp}`,
          type: 'line',
          source: `route_${waypoint.index}_${timestamp}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1086E8',
            'line-width': 8
          }
        })
      }
    }
  })

  console.log('Map, waypoints:', waypoints)

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