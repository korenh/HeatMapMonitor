import DateTimePicker from 'react-datetime-picker'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { Switch } from '@material-ui/core'
import Magnifier from 'react-magnifier'
import { toast } from 'react-toastify'
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

  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <ModeSelect live={live} setLive={setLive} />
          <RangeSelect range={range} setRange={setRange} />
          <DateSelect live={live} get_data={get_data} />
        </div>
        <PiePlot dtLabels={dtLabels} />
        <Magnifier src={subImg} width={250} />
      </div>
      <MainPlot plotDataDT={plotDataDT} dtLabels={dtLabels} setSubImg={setSubImg} url={url} />
    </div>
  )
}

export const MainPlot = ({ plotDataDT, dtLabels, setSubImg, url }) => {
  const plotLayoutDT = {
    width: window.innerWidth - 300, height: window.innerHeight, margin: { l: 150, r: 10, b: 25, t: 25, pad: 0 }, shapes: dtLabels,
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { color: 'black' }, yaxis: { color: 'black' }
  }

  const get_image = (p) => {
    setSubImg(`${url}/image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`)
  }

  return (<Plot data={plotDataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />)
}

export const PiePlot = ({ dtLabels }) => {
  const [colors, setColors] = useState({})

  useEffect(() => {
    let temp = { 'yellow': 0, 'blue': 0, 'green': 0, 'pink': 0, 'purple': 0 }
    dtLabels.map(label => { temp[label.line.color] += 1 })
    setColors(temp)
  }, [dtLabels])

  const plotDataPIE = [{
    values: Object.keys(colors).map(key => { return colors[key] }), labels: Object.keys(colors), type: 'pie',
    marker: { colors: ['yellow', 'blue', 'green', 'pink', 'purple',] }
  }]

  const plotLayoutPIE = {
    width: 250, height: 200, margin: { l: 0, r: 0, b: 0, t: 0, pad: 20 },
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', showlegend: false
  }

  return (<Plot data={plotDataPIE} layout={plotLayoutPIE} />)
}

export const ModeSelect = ({ live, setLive }) => {
  const setMode = (live) => {
    setLive(!live)
    toast.configure()
    toast.info(`${live ? 'Static' : 'Live'} Mode`, { autoClose: 2000 })
  }

  return (<Switch checked={live} onChange={() => setMode(live)} color={'black'} />)
}

export const RangeSelect = ({ range, setRange }) => {
  const timeRange = ['5m', '30m', '1h', '5h', '12h', '24h']

  return (
    <div><br />
      {timeRange.map(t => (t === range ?
        <span className='btn-range-selected'>{t}</span> : <span className='btn-range' onClick={() => setRange(t)}>{t}</span>
      ))}
    </div>)
}

export const DateSelect = ({ live, get_data }) => {
  const [value, setValue] = useState(new Date())

  return (
    <div className='select-wrap'>
      {live ? '' :
        <div><br />
          <DateTimePicker className='datetime' onChange={setValue} value={value} />
          <button className='btn-range' onClick={() => get_data(value.getTime())}>GET</button>
        </div>
      }
    </div>
  )
}