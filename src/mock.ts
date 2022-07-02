import { LngLat } from "mapbox-gl";
import { Route, Waypoint } from "./common/interfaces";

/**
 * https://stackoverflow.com/a/1527820
 */
function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const getCurrentPossition = (): Promise<GeolocationPosition> => {
  if (!('geolocation' in navigator)) throw new Error('Geolocation is not supported in this environmnet')

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => resolve(pos), (err) => reject(err))
  })
}

const generateWaypoints = async (points: number): Promise<Waypoint[]> => {
  const startPos = await getCurrentPossition()
  const minDistance = 0.005
  const maxDistance = 0.01

  let waypoints: Waypoint[] = []

  for (let i = 0; i < points; i++) {
    waypoints.push({
      id: String(Date.now()),
      name: `Waypoint ${i + 1}`,
      index: i,
      coordinates: [
        i === 0
          ? startPos.coords.longitude
          : waypoints[i - 1].coordinates[0] + getRandomArbitrary(minDistance, maxDistance) * (Math.random() < 0.5 ? -1 : 1),
        i === 0
          ? startPos.coords.latitude
          : waypoints[i - 1].coordinates[1] + getRandomArbitrary(minDistance, maxDistance) * (Math.random() < 0.5 ? -1 : 1)
      ]
    })
  }

  return waypoints
}

export const getMockRoute = async (waypoints: number = 4): Promise<Route> => ({
  waypoints: await generateWaypoints(waypoints)
})