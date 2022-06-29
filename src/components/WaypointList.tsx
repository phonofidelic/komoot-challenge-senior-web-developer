import { List, ListItem } from '@mui/material'
import React from 'react'
import { Waypoint } from '../common/interfaces'

type WaypointListProps = {
  waypoints: Waypoint[]
}

export default function WaypointList({ waypoints }: WaypointListProps) {
  return (
    <List>
      {waypoints.map((waypoint) => (
        <ListItem key={waypoint.index}>{waypoint.name}</ListItem>
      ))}
    </List>
  )
}