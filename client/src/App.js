import { TextField, Switch } from '@material-ui/core';
import { useEffect, useState } from 'react'
import Magnifier from 'react-magnifier'
import SubImg from './img/icon.png'
import Plot from 'react-plotly.js'
import axios from 'axios'

export default function App() {

  const url = 'http://localhost:5000'
  const [live, setLive] = useState(true)
  const [range, setRange] = useState('12h')
  const [dtLabels, setDtLabels] = useState([])
  const [subImg, setSubImg] = useState(SubImg)
  const [plotDataDT, setPlotDataDT] = useState([])
  const [plotDataMP, setPlotDataMP] = useState([])
  const timeRange = ['5m', '30m', '1h', '5h', '12h']
  const plotLayoutMP = {
    width: 250, height: 200, margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 }, paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5',
    geo: {
      scope: 'asia', showrivers: true, rivercolor: '#F5F5F5', showlakes: true, lakecolor: '#F5F5F5', showsubunits: true,
      showland: true, landcolor: '#EAEAAE', countrycolor: '#d3d3d3', countrywidth: 1.5, subunitcolor: '#d3d3d3', bgcolor: '#F5F5F5'
    }
  }
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
        setPlotDataMP([{ type: 'scattergeo' }])
        setPlotDataDT([{ z: res.data.dt.data, y: res.data.dt.time, type: 'heatmap', colorscale: 'Viridis', showscale: false }])
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
      default:
        return 720
    }
  }

  const get_image = (p) => {
    let img_url = `${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`
    img_url = img_url.replaceAll('|', '_').replaceAll(':', '-')
    setSubImg(`${url}/image/${img_url}`)
  }

  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <Switch checked={live} onChange={() => setLive(!live)} color={'black'} />
          {live ? '' : <TextField type="datetime-local" onChange={t => get_data(t.timeStamp)} />}
          <br /><br />
          {timeRange.map(t => (t === range ?
            <span className='btn-range-selected'>{t}</span> : <span className='btn-range' onClick={() => setRange(t)}>{t}</span>
          ))}
        </div>
        <Plot data={plotDataMP} layout={plotLayoutMP} />
        <Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <Plot data={plotDataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
    </div>
  );
}

