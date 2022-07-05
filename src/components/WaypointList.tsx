import React, { useRef, useState } from 'react'
import { Waypoint } from '../common/interfaces'
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
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

  const handleDragStart = (
    event: React.DragEvent<HTMLLIElement | HTMLDivElement>, index: number) => {
    //@ts-ignore
    event.target.parentElement.style.opacity = '0.5'
    //@ts-ignore
    event.dataTransfer.setDragImage(event.target.parentElement, 0, 0)

    dragItem.current = index;
    setDragIndex(index)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>, index: number) => {
    event.preventDefault()
    dragOverItem.current = index;
    setDragOverIndex(index)
  }

  const handleDrop = (event: React.DragEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>) => {
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

  if (!waypoints.length) return (
    <div style={{ padding: 16 }}>
      <Typography variant="caption">Double-click a point on the map to add a waypoint.</Typography>
    </div>
  )

  return (
    <List>
      {waypoints.map((waypoint, i) => (
        <ListItem
          key={waypoint.id}
          style={{
            cursor: 'pointer',
            opacity: dragIndex === i ? '0.5' : 'unset',
            backgroundColor: '#383838',
            borderBottom: dragIndex !== null && dragIndex < i && dragOverIndex === i ? '2px solid #C3E452' : 'none',
            borderTop: dragIndex !== null && dragIndex !== waypoints.length && dragIndex > i && dragOverIndex === i ? '2px solid #C3E452' : 'none',
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
          <div  
            id={`drag-handle_${i}`}
            draggable
          >
          <MenuIcon style={{ 
            color: '#747474', 
            marginRight: 16,
            cursor: 'grab'
          }} />
          </div>
          <ListItemText>{waypoint.name}</ListItemText>
        </ListItem>              
      ))}
    </List>
  )
}