import React, { useEffect, useRef } from 'react'
import mapboxgl, { LngLat, Map as _Map, MapMouseEvent } from 'mapbox-gl';
import { Route } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  onAddWaypoint(coortinagtes: LngLat): Route | undefined
}

export default function Map({ onAddWaypoint }: MapProps) {
  const mapContainer = useRef(null)
  const mapRef = useRef<_Map | null>(null)

  const handleDblClick = (event: MapMouseEvent): Route | undefined => {
    event.preventDefault()
    console.log('handleDblClick:', event.lngLat)
    return onAddWaypoint(event.lngLat)
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



    if (!mapRef.current) return;

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


    mapRef.current.on('load', () => {
      console.log('*** map onload ***')
    })

    /**
     * Register map interaction events
     */
    mapRef.current.on('dblclick', (event: MapMouseEvent) => {
      /**
       * Render new Waypoint marker
       */
      const route = handleDblClick(event)
      if (!route) return
      const waypoint = route.waypoints[route.waypoints.length - 1]
      console.log('on dblclick, waypoint:', waypoint)
      console.log('on dblclick, route:', route)
      if (!waypoint) return;

      const markerEl = document.createElement('div')
      markerEl.className = 'marker'
      markerEl.innerHTML = String(waypoint.index + 1)

      new mapboxgl.Marker(markerEl)
        .setLngLat(waypoint.coordinates)
        .addTo(mapRef.current!)

      /**
       * Render path line
       */
      if (waypoint.index < 1) return;
      if (!mapRef.current) return;

      mapRef.current.addSource(`route_${waypoint.index}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              route.waypoints[waypoint.index - 1].coordinates,
              waypoint.coordinates,
            ]
          }
        }
      })
      mapRef.current.addLayer({
        id: `route_${waypoint.index}`,
        type: 'line',
        source: `route_${waypoint.index}`,
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

    return () => {
      if (!mapRef.current) return;
      mapRef.current.remove()
    };
  })

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