export default function RangeSelect({ range, setRange }) {

    const timeRange = ['5m', '30m', '1h', '5h', '12h', '24h']

    return <div><br />
        {timeRange.map(t => (t === range ?
            <span className='btn-range-selected'>{t}</span> : <span className='btn-range' onClick={() => setRange(t)}>{t}</span>
        ))}
    </div>
}
