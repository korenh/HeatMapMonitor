import Plot from 'react-plotly.js'
import { useEffect, useState } from 'react'


export default function LinePlot({ dtLabels, timeDT }) {

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
