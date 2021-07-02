import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios'

export default function App() {

  const [data, setData] = useState([])
  const [time, setTime] = useState([])


  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(res => {
        setData(res.data.data)
        setTime(res.data.time)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <Plot
      data={[
        {
          z: data,
          y: time,
          type: 'heatmap',
          colorscale: 'Viridis',
        }
      ]}
      layout={{ width: window.innerWidth, height: window.innerHeight, title: 'Data' }}
    />
  );
}

