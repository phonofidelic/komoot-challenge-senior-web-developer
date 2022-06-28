import React, { useEffect, useState } from 'react';
import './App.css';
import { getMockRoute } from './mock';
import Map from './components/Map';
import { Route } from './common/interfaces';
import { Grid } from '@mui/material';



function App() {
  const [mockRoute, setMockRouteData] = useState<Route | null>(null)

  useEffect(() => {
    const getData = async () => {
      const mockRouteData: Route = await getMockRoute(5)
      console.log('mockRouteData:', mockRouteData)
      setMockRouteData(mockRouteData)
    }
    getData()
  }, [])


  if (!mockRoute) return <div>Loading...</div>

  return (
    <Grid container style={{
      color: '#fff',
      backgroundColor: '#383838',
      height: '100vh',
      width: '100%'
    }}>
      <Grid item sm={4}>SideBar</Grid>
      <Grid style={{
        width: '100%',
        height: '100%'
      }} item sm={8}>
        <Map route={mockRoute} />
      </Grid>
    </Grid>
  );
}

export default App;
