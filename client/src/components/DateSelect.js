import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'


export default function DateSelect({ live, fetchData }) {

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

