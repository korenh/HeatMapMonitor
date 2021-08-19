import axios from 'axios'
import Magnifier from 'react-magnifier'
import BarPlot from './components/BarPlot'
import { useEffect, useState } from 'react'
import MainPlot from './components/MainPlot'
import LinePlot from './components/LinePlot'
import SubImg from './components/img/icon.png'
import KeyHandler from './components/KeyHandler'
import DateSelect from './components/DateSelect'
import ModeSelect from './components/ModeSelect'
import RangeSelect from './components/RangeSelect'
import { validImage, rangeToMinutes } from './components/functions'


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


  return (
    <div className='main'>
      <div className='main-nav'>
        <div className='main-nav-sub'>
          <ModeSelect live={live} setLive={setLive} />
          <RangeSelect range={range} setRange={setRange} />
          <DateSelect live={live} fetchData={fetchData} />
        </div>
        <Magnifier src={subImg} width={250} />
        <BarPlot dtLabels={dtLabels} />
      </div>
      <KeyHandler setSubImg={setSubImg} setSensor={setSensor} date={date} sensor={sensor} url={url} validImage={validImage} />
      <div>
        <MainPlot dataDT={dataDT} dtLabels={dtLabels} setSubImg={setSubImg} url={url} setDate={setDate} setSensor={setSensor} validImage={validImage} />
        <LinePlot dtLabels={dtLabels} timeDT={timeDT} />
      </div>
    </div>
  )
}

