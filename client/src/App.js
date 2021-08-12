import KeyboardEventHandler from 'react-keyboard-event-handler'
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
  const [date, setDate] = useState('')
  const [live, setLive] = useState(true)
  const [sensor, setSensor] = useState('')
  const [dataDT, setDataDT] = useState([])
  const [timeDT, setTimeDT] = useState([])
  const [range, setRange] = useState('12h')
  const [dtLabels, setDtLabels] = useState([])
  const [subImg, setSubImg] = useState(SubImg)


  useEffect(() => {
    if (live) {
      const interval = setInterval(() => { fetchData() }, 10000)
      return () => clearInterval(interval)
    }
  }, [live, range])


  const fetchData = (timestamp = '') => {
    axios.post(`${url}/data`, { range: rangeToMinutes(range), timestamp })
      .then(res => {
        setTimeDT(res.data.dt.time)
        setDtLabels(res.data.dt.labels)
        setDataDT([{ z: res.data.dt.data, y: res.data.dt.time, type: 'heatmap', colorscale: [['0', '#F5F5F5'], ['1', '#F5F5F5']], showscale: false }])
      })
      .catch(err => console.error(err))
  }


  const rangeToMinutes = (t) => {
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
          <DateSelect live={live} fetchData={fetchData} />
        </div>
        <Magnifier src={subImg} width={250} />
        <PiePlot dtLabels={dtLabels} />
      </div>
      <Keyboard setSubImg={setSubImg} setSensor={setSensor} date={date} sensor={sensor} url={url} />
      <div>
        <MainPlot dataDT={dataDT} dtLabels={dtLabels} setSubImg={setSubImg} url={url} setDate={setDate} setSensor={setSensor} />
        <LinePlot dtLabels={dtLabels} timeDT={timeDT} />
      </div>
    </div>
  )
}


export const MainPlot = ({ dataDT, dtLabels, setSubImg, url, setDate, setSensor }) => {

  const plotLayoutDT = {
    width: window.innerWidth - 300, height: window.innerHeight * 0.9, margin: { l: 150, r: 10, b: 25, t: 25, pad: 0 }, shapes: dtLabels,
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { color: 'black' }, yaxis: { color: 'black' }
  }

  const get_image = (p) => {
    setDate(p.points[0].y)
    setSensor(p.points[0].x)
    setSubImg(`${url}/image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`)
  }

  return <Plot data={dataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
}


export const PiePlot = ({ dtLabels }) => {

  const [colors, setColors] = useState({})

  useEffect(() => {
    let dataSplit = { 'yellow': 0, 'blue': 0, 'green': 0, 'pink': 0, 'purple': 0 }
    dtLabels.forEach(label => { dataSplit[label.line.color] += 1 })
    setColors(dataSplit)
  }, [dtLabels])

  const plotDataPIE = [{
    y: Object.keys(colors).map(key => { return colors[key] }), x: Object.keys(colors), type: 'bar',
    marker: { color: ['yellow', 'blue', 'green', 'pink', 'purple',] }
  }]

  const plotLayoutPIE = {
    width: 250, height: 270, margin: { l: 0, r: 0, b: 20, t: 40, pad: 0 },
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', showlegend: false
  }

  return <Plot data={plotDataPIE} layout={plotLayoutPIE} />
}


export const LinePlot = ({ dtLabels, timeDT }) => {

  const [counts, setCounts] = useState([])

  useEffect(() => {
    let dataSplit = {}
    dtLabels.forEach((label) => { dataSplit[Math.trunc(label.y1)] = (dataSplit[Math.trunc(label.y1)] || 0) + 1 });
    setCounts([{ x: timeDT, y: Object.keys(dataSplit).map(key => { return dataSplit[key] }), type: 'scatter', line: { color: 'blue' } }])
  }, [dtLabels, timeDT])

  const plotLayoutLI = {
    width: window.innerWidth - 300, height: window.innerHeight * 0.1, margin: { l: 0, r: 0, b: 20, t: 0, pad: 0 },
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { showgrid: false, showticklabels: false }, yaxis: { showgrid: false }
  }

  return <Plot data={counts} layout={plotLayoutLI} />
}


export const ModeSelect = ({ live, setLive }) => {

  const setMode = (live) => {
    setLive(!live)
    toast.configure()
    toast.info(`${live ? 'Static' : 'Live'} Mode`, { autoClose: 2000 })
  }

  return <Switch checked={live} onChange={() => setMode(live)} color={'black'} />
}


export const RangeSelect = ({ range, setRange }) => {

  const timeRange = ['5m', '30m', '1h', '5h', '12h', '24h']

  return <div><br />
    {timeRange.map(t => (t === range ?
      <span className='btn-range-selected'>{t}</span> : <span className='btn-range' onClick={() => setRange(t)}>{t}</span>
    ))}
  </div>
}


export const DateSelect = ({ live, fetchData }) => {

  const [value, setValue] = useState(new Date())

  return <div className='select-wrap'>
    {live ? '' :
      <div><br />
        <DateTimePicker className='datetime' onChange={setValue} value={value} />
        <button className='btn-range' onClick={() => fetchData(value.getTime())}>GET</button>
      </div>
    }
  </div>
}


export const Keyboard = ({ setSubImg, setSensor, date, sensor, url }) => {

  return <div>
    <KeyboardEventHandler
      handleKeys={['left', 'right']}
      onKeyEvent={(key, e) => {
        if (key === 'right') {
          setSubImg(`${url}/image/` + date + '/' + date + '_' + (parseInt(sensor) + 1).toString().padStart(4, 0) + '.png')
          setSensor((parseInt(sensor) + 1).toString().padStart(4, 0))
        }
        if (key === 'left') {
          setSubImg(`${url}/image/` + date + '/' + date + '_' + (parseInt(sensor) - 1).toString().padStart(4, 0) + '.png')
          setSensor((parseInt(sensor) - 1).toString().padStart(4, 0))
        }
      }
      } />
  </div>
}