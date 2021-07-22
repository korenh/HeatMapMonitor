import { TextField, Switch } from '@material-ui/core';
import { useEffect, useState } from 'react'
import Magnifier from 'react-magnifier'
import SubImg from './img/icon.png'
import Plot from 'react-plotly.js'
import axios from 'axios'

export default function App() {

  const url = 'http://localhost:5000/'
  const [live, setLive] = useState(true)
  const [dtLabels, setDtLabels] = useState([])
  const [subImg, setSubImg] = useState(SubImg)
  const [date, setDate] = useState(new Date())
  const [plotDataDT, setPlotDataDT] = useState([])
  const W = { w: window.innerWidth, h: window.innerHeight }
  const timeRange = ['5m', '30m', '1h', '5h', '12h']
  const plotLayoutDT = {
    width: W.w - 300, height: W.h, margin: { l: 150, r: 0, b: 30, t: 20, pad: 0 }, shapes: dtLabels,
    paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { color: 'black' }, yaxis: { color: 'black' }
  }


  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        axios.post(`${url}data`, {})
          .then(res => {
            setDtLabels(res.data.dt.labels)
            setPlotDataDT([{ z: res.data.dt.data, y: res.data.dt.time, type: 'heatmap', colorscale: 'Viridis', showscale: false }])
          })
          .catch(err => console.error(err))
      }, 10000)
      return () => clearInterval(interval);
    }
  }, [live]);


  const get_image = (p) => {
    let img_url = `${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`
    img_url = img_url.replaceAll('|', '_').replaceAll(':', '-')
    setSubImg(`${url}image/${img_url}`)
  }

  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <Switch checked={live} onChange={() => setLive(!live)} color={'black'} />
          {live ? '' : (<TextField type="datetime-local" />)}<br /><br />
          {timeRange.map(t => (<span className='btn-range'>{t}</span>))}
        </div>
        <Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <Plot data={plotDataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
    </div>
  );
}

