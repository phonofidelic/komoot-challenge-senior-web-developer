import React, { useEffect, useRef } from 'react'
import mapboxgl, { LngLat, Map as _Map, MapMouseEvent, Marker } from 'mapbox-gl';
import { Waypoint } from '../common/interfaces';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {
  waypoints: Waypoint[];
  onAddWaypoint(coortinagtes: LngLat): void;
  onMoveWaypoint(waypoint: Waypoint): void;
}

export default function Map({ waypoints, onAddWaypoint, onMoveWaypoint }: MapProps) {
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
      // style: 'mapbox://styles/phonofidelic/ckn2dzfo22ys217n4be9x5l3e',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 12,
      attributionControl: false,
    });

    /**
     * Get current location and position the map.
     * Set default map position and zoom if the user rejects location permissions.
     */
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mapRef.current) return;
        mapRef.current.setCenter([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => {
        console.error('Could not get position:', err);
        if (!mapRef.current) return;
        mapRef.current.setCenter([0,0]).setZoom(0);
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
      markerEl.id = `marker_${waypoint.id}`
      markerEl.className = 'marker'
      markerEl.innerHTML = String(waypoint.index + 1)

      const marker = new mapboxgl.Marker(markerEl, { draggable: true })
        .setLngLat(waypoint.coordinates)      
        .on('drag', (e: any) => {
          if(!mapRef.current) return

          const fromLine = mapRef.current.getSource(`route_${waypoint.id}`)
          if (fromLine) {
            mapRef.current
              .getSource(`route_${waypoint.id}`)
              //@ts-ignore
              .setData({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    waypoints[i - 1].coordinates,
                    [e.target._lngLat.lng, e.target._lngLat.lat],
                  ]
                }
              })
          }

          if (waypoints[i+1]) {
            mapRef.current
              .getSource(`route_${waypoints[i+1].id}`)
              //@ts-ignore
              .setData({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [e.target._lngLat.lng, e.target._lngLat.lat],
                    waypoints[i + 1].coordinates,
                  ]
                }
              })
          }
        })
        .on('dragend', (e: any) => {
          onMoveWaypoint({...waypoint, coordinates: [e.target._lngLat.lng, e.target._lngLat.lat] })
        })
        .addTo(mapRef.current)

      markers.push(marker)

      if (i > 0 && mapRef.current !== null) {
        const pathId = `route_${waypoint.id}`
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
     * Clear map on each re-render
     */
    return () => {
      markers.forEach(marker => marker.remove())
      pathIds.forEach(pathId => {
        mapRef.current?.getLayer(pathId) && mapRef.current?.removeLayer(pathId)
        mapRef.current?.getSource(pathId) && mapRef.current?.removeSource(pathId)
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