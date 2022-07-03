import React, { useRef, useState } from 'react'
import { Waypoint } from '../common/interfaces'
import { IconButton, List, ListItem, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';

type WaypointListProps = {
  waypoints: Waypoint[]
  onRemoveWaypoint(waypointIndex: number): void
  onOrderWaypoints(newList: Waypoint[]): void
}

export default function WaypointList({ waypoints, onRemoveWaypoint, onOrderWaypoints }: WaypointListProps) {
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    dragItem.current = index;
    setDragIndex(index)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault()
    dragOverItem.current = index;
    setDragOverIndex(index)
  }

  const handleDrop = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault()
    if (dragItem.current === null || dragOverItem.current === null) return

    let updatedList = [...waypoints]
    const [reorderedItem] = updatedList.splice(dragItem.current, 1)
    updatedList.splice(dragOverItem.current, 0, reorderedItem)

    onOrderWaypoints(updatedList)

    dragItem.current = null
    dragOverItem.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <List>
      {waypoints.map((waypoint, i) => (
        <ListItem
          key={waypoint.id}
          draggable
          style={{
            cursor: 'pointer',
            opacity: dragIndex === i ? '0.5' : 'unset',
            backgroundColor: dragOverIndex === i ? '#819248' : '#383838',
            border: dragOverIndex === i ? '2px solid #C3E452' : 'none'
          }}
          secondaryAction={
            <IconButton onClick={() => onRemoveWaypoint(waypoint.index)}>
              <DeleteIcon style={{ color: '#747474' }} />
            </IconButton>
          }
          onDragStart={(event) => handleDragStart(event, i)}
          onDragEnter={(event) => handleDragEnter(event, i)}
          onDragEnd={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <MenuIcon style={{ 
            color: '#747474', 
            marginRight: 16,
            cursor: 'grab'
          }} />
          <ListItemText>{waypoint.name}</ListItemText>
        </ListItem>              
      ))}
    </List>
  )
}