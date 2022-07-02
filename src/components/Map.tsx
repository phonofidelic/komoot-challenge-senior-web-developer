import React, { useEffect, useRef } from 'react'
import mapboxgl, { LngLat, Map as _Map, MapMouseEvent, Marker } from 'mapbox-gl';
import { Waypoint } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  waypoints: Waypoint[]
  onAddWaypoint(coortinagtes: LngLat): void
}

export default function Map({ waypoints, onAddWaypoint }: MapProps) {
  const mapContainer = useRef(null)
  const mapRef = useRef<_Map | null>(null)

  const handleDblClick = (event: MapMouseEvent) => {
    event.preventDefault()
    onAddWaypoint(event.lngLat)
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
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let markers: Marker[] = [];
    let pathIds: string[] = []
    if (!mapRef.current) return;

    for (const [i, waypoint] of waypoints.entries()) {
      const markerEl = document.createElement('div')
      markerEl.className = 'marker'
      markerEl.innerHTML = String(waypoint.index + 1)

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(waypoint.coordinates)
        .addTo(mapRef.current)

      markers.push(marker)

      if (i > 0 && mapRef.current !== null) {
        const timestamp = Date.now()
        const pathId = `route_${waypoint.id}_${timestamp}`
        mapRef.current.addSource(pathId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                waypoints[i - 1].coordinates,
                waypoint.coordinates,
              ]
            }
          }
        })
        mapRef.current.addLayer({
          id: pathId,
          type: 'line',
          source: pathId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1086E8',
            'line-width': 8
          }
        })
        pathIds.push(pathId)
      }
    }

    /**
     * Cleaar map on each re-render
     */
    return () => {
      markers.forEach(marker => marker.remove())
      pathIds.forEach(pathId => {
        mapRef.current?.removeLayer(pathId)
      })
    }
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