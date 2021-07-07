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
  const [time, setTime] = useState([])
  const [date, setDate] = useState(new Date());
  const [subImg, setSubImg] = useState(SubImg)

  useEffect(() => {
    const interval = setInterval(() => {
      axios.post(`${url}data`, {})
        .then(res => {
          setData(res.data.data)
          setTime(res.data.time)
        })
        .catch(err => console.error(err))
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='main'>
      <div className='main-nav'>
        <DatePicker selected={date} onChange={date => setDate(date)} showTimeSelect dateFormat="dd-MM-yyyy_hh-mm-ss" />
        <br /><br /><Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <Plot
        data={[{ z: data, y: time, type: 'heatmap', colorscale: 'Viridis' }]}
        layout={{ width: window.innerWidth - 300, height: window.innerHeight }}
        onClick={p => setSubImg(`${url}image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`)}
      />
    </div>
  );
}

