import React, { useEffect, useState } from 'react';
import './App.css';
import { getMockRoute } from './mock';
import Map from './components/Map';
import { Route } from './common/interfaces';


function App() {
  const [mockRoute, setMockRouteData] = useState<Route | null>(null)

  useEffect(() => {
    const getData = async () => {
      const mockRouteData: Route = await getMockRoute()
      console.log('mockRouteData:', mockRouteData)
      setMockRouteData(mockRouteData)
    }
    getData()
  }, [])


  if (!mockRoute) return <div>Loading...</div>

  return (
    <div className="App" style={{
      display: 'flex',
      width: '100%',
      height: '100vh'
    }}>
      <div className="side-bar" style={{
        border: '1px solid red',
        boxSizing: 'border-box',
        width: '25%'
      }}>SideBar</div>
      <Map route={mockRoute} />
    </div>
  );
}

export default App;
