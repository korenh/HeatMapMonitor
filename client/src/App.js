import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import Plot from 'react-plotly.js';
import axios from 'axios'

export default function App() {

  const [data, setData] = useState([])
  const [time, setTime] = useState([])
  const [date, setDate] = useState(new Date());


  useEffect(() => {
    const interval = setInterval(() => {
      axios.post('http://localhost:5000/data', {})
        .then(res => {
          setData(res.data.data)
          setTime(res.data.time)
        })
        .catch(err => console.error(err))
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className='main-picker'>
        <DatePicker
          selected={date}
          onChange={date => setDate(date)}
          showTimeSelect
          dateFormat="dd-MM-yyyy_hh-mm-ss"
        />
      </div>
      <Plot
        data={[{ z: data, y: time, type: 'heatmap', colorscale: 'Viridis' }]}
        layout={{ width: window.innerWidth, height: window.innerHeight }}
      />
    </div>
  );
}

