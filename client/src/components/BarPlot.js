import Plot from 'react-plotly.js'
import { useEffect, useState } from 'react'


export default function BarPlot({ dtLabels }) {

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
