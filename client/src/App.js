import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import Magnifier from 'react-magnifier'
import SubImg from './img/icon.png'
import Plot from 'react-plotly.js';
import axios from 'axios'

export default function App() {

  const url = 'http://localhost:5000/'
  const [data, setData] = useState([])
  const [shapes, setShapes] = useState([])
  const [time, setTime] = useState([])
  const [date, setDate] = useState(new Date());
  const [subImg, setSubImg] = useState(SubImg)
  const plotData = [{ z: data, y: time, type: 'heatmap', colorscale: 'Viridis' }]
  const plotLayout = { width: window.innerWidth - 300, height: window.innerHeight, shapes }

  useEffect(() => {
    const interval = setInterval(() => {
      axios.post(`${url}data`, {})
        .then(res => {
          setData(res.data.data)
          setTime(res.data.time)
          setShapes(res.data.shapes)
        })
        .catch(err => console.error(err))
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const get_image = (p) => {
    setSubImg(`${url}image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`)
  }

  return (
    <div className='main'>
      <div className='main-nav'>
        <DatePicker selected={date} showTimeSelect dateFormat="Pp" onChange={date => setDate(date.getTime())} /><br /><br />
        <Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <Plot data={plotData} layout={plotLayout} onClick={p => get_image(p)} />
    </div>
  );
}

