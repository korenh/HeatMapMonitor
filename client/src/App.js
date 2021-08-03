import DateTimePicker from 'react-datetime-picker';
import { useEffect, useState } from 'react'
import { Switch } from '@material-ui/core'
import Magnifier from 'react-magnifier'
import SubImg from './img/icon.png'
import Plot from 'react-plotly.js'
import axios from 'axios'

export default function App() {

  const url = 'http://localhost:8080'
  const [live, setLive] = useState(true)
  const [range, setRange] = useState('12h')
  const [dtLabels, setDtLabels] = useState([])
  const [subImg, setSubImg] = useState(SubImg)
  const [plotDataDT, setPlotDataDT] = useState([])
  const [value, onChange] = useState(new Date())
  const timeRange = ['5m', '30m', '1h', '5h', '12h', '24h']
  const plotLayoutDT = {
    width: window.innerWidth - 300, height: window.innerHeight, margin: { l: 150, r: 10, b: 25, t: 25, pad: 0 }, shapes: dtLabels,
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { color: 'black' }, yaxis: { color: 'black' }
  }

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => { get_data() }, 10000)
      return () => clearInterval(interval)
    }
  }, [live, range])

  const get_data = (timestamp = '') => {
    axios.post(`${url}/data`, { range: get_minute(range), timestamp })
      .then(res => {
        setDtLabels(res.data.dt.labels)
        setPlotDataDT([{
          z: res.data.dt.data, y: res.data.dt.time, type: 'heatmap',
          colorscale: [['0', '#F5F5F5'], ['1', '#F5F5F5']], showscale: false
        }])
      })
      .catch(err => console.error(err))
  }

  const get_minute = (t) => {
    switch (t) {
      case '5m':
        return 5
      case '30m':
        return 30
      case '1h':
        return 60
      case '5h':
        return 300
      case '12h':
        return 720
      default:
        return 1440
    }
  }

  const get_image = (p) => {
    setSubImg(`${url}/image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`)
  }

  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <Switch checked={live} onChange={() => setLive(!live)} color={'black'} />
          {live ? '' :
            <div>
              <DateTimePicker onChange={onChange} value={value} />
              <button className='btn-range' onClick={() => get_data(value.getTime())}>Get</button>
            </div>
          }
          <br />
          {timeRange.map(t => (t === range ?
            <span className='btn-range-selected'>{t}</span> : <span className='btn-range' onClick={() => setRange(t)}>{t}</span>
          ))}
        </div>
        <Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <Plot data={plotDataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
    </div>
  );
}

