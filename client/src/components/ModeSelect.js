import { toast } from 'react-toastify'
import { Switch } from '@material-ui/core'
import 'react-toastify/dist/ReactToastify.css'


export default function ModeSelect({ live, setLive }) {

    const setMode = (live) => {
        setLive(!live)
        toast.configure()
        toast.info(`${live ? 'Static' : 'Live'} Mode`, { autoClose: 2000 })
    }

    return <Switch checked={live} onChange={() => setMode(live)} color={'black'} />
}
