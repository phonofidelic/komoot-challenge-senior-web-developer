import React from 'react'
import { Waypoint } from '../common/interfaces'
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

type WaypointListProps = {
  waypoints: Waypoint[]
  onRemoveWaypoint(waypointIndex: number): void
  onOrderWaypoints(newList: Waypoint[]): void
}



export default function WaypointList({ waypoints, onRemoveWaypoint, onOrderWaypoints }: WaypointListProps) {
  const handleDrop = (droppedItem: any) => {
    /**
     * Adapted from: https://contactmentor.com/react-drag-drop-list/
     */
    if (!droppedItem.destination) return;
    console.log('*** droppedItem:', droppedItem)
    let updatedList = [...waypoints]
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    const finalList = updatedList.map((item, index) => ({
      ...item,
      name: `Waypoint ${index + 1}`,
      index
    }))

    onOrderWaypoints(finalList)
  }

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <List id="list-container" ref={provided.innerRef} {...provided.droppableProps}>
            {waypoints.map((waypoint, i) => (
              <Draggable key={waypoint.id} draggableId={waypoint.id} index={i}>
                {(provided) => (
                  <ListItem
                    style={{
                      cursor: 'pointer'
                    }}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    secondaryAction={
                      <IconButton onClick={() => onRemoveWaypoint(waypoint.index)}>
                        <DeleteIcon style={{ color: '#747474' }} />
                      </IconButton>
                    }
                  >
                    <MenuIcon style={{ 
                      color: '#747474', 
                      marginRight: 16,
                      cursor: 'grab'
                    }} />
                    <ListItemText>{waypoint.name}</ListItemText>
                  </ListItem>
                )}
              </Draggable>
              
            ))}
          </List>
        )}
      </Droppable>
      
    </DragDropContext>
  )
}