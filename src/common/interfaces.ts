export interface Waypoint {
  id: string;
  name: string;
  index: number;
  coordinates: [number, number];
  links?: Waypoint[];
}

export interface Route {
  waypoints: Waypoint[]
}