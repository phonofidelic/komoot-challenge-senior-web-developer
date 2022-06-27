import { Route, Waypoint } from "./common/interfaces";

const getCurrentPossition = (): Promise<GeolocationPosition> => {
  if (!('geolocation' in navigator)) throw new Error('Geolocation is not supported in this environmnet')

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => resolve(pos), (err) => reject(err))
  })
}

const generateWaypoints = async (poins: number): Promise<Waypoint[]> => {
  const pos = await getCurrentPossition()
  console.log('pos:', pos)

  return [
    {
      name: 'Waypoint 1',
      coordinates: [pos.coords.latitude, pos.coords.longitude],
      links: []
    }
  ]
}

export const getMockRoute = async (waypoints: number = 4): Promise<Route> => ({
  //@ts-ignore
  waypoints: await generateWaypoints(waypoints)
})