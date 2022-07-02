export interface Waypoint {
  id: string;
  name: string;
  index: number;
  coordinates: [number, number];
}

export interface Route {
  waypoints: Waypoint[]
}