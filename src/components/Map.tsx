import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN || ''

type MapProps = {}

export default function Map({ }: MapProps) {
  const mapContainer = useRef(null)

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/phonofidelic/ckn2dzfo22ys217n4be9x5l3e',
      zoom: 12,
      attributionControl: false,
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('position:', pos);

        map.setCenter([pos.coords.longitude, pos.coords.latitude]);
      },
      (err) => {
        console.error('Could not get position:', err);
      }
    );

    return () => map.remove();
  }, [])
  return (
    <div ref={mapContainer} id="map-container" className="map-container" style={{
      border: '1px solid cyan',
      boxSizing: 'border-box',
      width: '75%',
      height: '100%'
    }} />
  )
}