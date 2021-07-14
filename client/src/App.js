import 'react-datepicker/dist/react-datepicker.css'
import Switch from '@material-ui/core/Switch'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Magnifier from 'react-magnifier'
import SubImg from './img/icon.png'
import Plot from 'react-plotly.js'
import axios from 'axios'

export default function App() {

  const url = 'http://localhost:5000/'
  const [live, setLive] = useState(true)
  const [dtLabels, setDtLabels] = useState([])
  const [wfLabels, setWfLabels] = useState([])
  const [subImg, setSubImg] = useState(SubImg)
  const [date, setDate] = useState(new Date())
  const [plotDataDT, setPlotDataDT] = useState([])
  const [plotDataWF, setPlotDataWF] = useState([])
  const W = { w: window.innerWidth, h: window.innerHeight }
  const plotLayoutDT = { width: W.w - 300, height: W.h * 0.6, margin: { l: 150, r: 0, b: 30, t: 20, pad: 0 }, shapes: dtLabels }
  const plotLayoutWF = { width: W.w - 300, height: W.h * 0.4, margin: { l: 150, r: 0, b: 30, t: 0, pad: 0 }, shapes: wfLabels }


  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        axios.post(`${url}data`, {})
          .then(res => {
            setDtLabels(res.data.dt.labels)
            setWfLabels(res.data.wf.labels)
            setPlotDataDT([{ z: res.data.dt.data, y: res.data.dt.time, type: 'heatmap', colorscale: 'Viridis', showscale: false }])
            setPlotDataWF([{ z: res.data.wf.data, y: res.data.wf.time, type: 'heatmap', colorscale: 'Viridis', showscale: false }])
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

  const get_static_data = (date) => {
    let timestamp = date.getTime()
    setDate(date)
  }

  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <Switch checked={live} onChange={() => setLive(!live)} />
          {live ? '' : (<DatePicker selected={date} showTimeSelect dateFormat="Pp" onChange={date => get_static_data(date)} />)}
        </div>
        <Magnifier src={subImg} width={250} zoomFactor={1.5} />
      </div>
      <div>
        <Plot data={plotDataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
        <Plot data={plotDataWF} layout={plotLayoutWF} />
      </div>
    </div>
  );
}

