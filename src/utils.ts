import { BaseBuilder } from 'gpx-builder';
import { Waypoint } from "./common/interfaces";

export function downloadRoute(waypoints: Waypoint[]): void {
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

  if (!gpxData || !gpxData.attributes || !gpxData.wpt) throw new Error('No valid GPX data found')

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

  const element = document.createElement('a');
  const filename = `Route Builder ${new Date().toLocaleString()}.gpx`
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}