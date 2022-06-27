export interface Waypoint {
  name: string;
  coordinates: [number, number];
  links: Waypoint[];
}

export interface Route {
  waypoints: Waypoint[]
}