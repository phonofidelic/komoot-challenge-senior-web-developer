import React from 'react'
import { Waypoint } from '../common/interfaces'
import { IconButton, List, ListItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

type WaypointListProps = {
  waypoints: Waypoint[]
  onRemoveWaypoint(waypointIndex: number): void
}

export default function WaypointList({ waypoints, onRemoveWaypoint }: WaypointListProps) {
  return (
    <List>
      {waypoints.map((waypoint) => (
        <ListItem
          key={waypoint.index}
          secondaryAction={
            <IconButton onClick={() => onRemoveWaypoint(waypoint.index)}>
              <DeleteIcon style={{ color: '#747474' }} />
            </IconButton>
          }
        >
          {waypoint.name}
        </ListItem>
      ))}
    </List>
  )
}