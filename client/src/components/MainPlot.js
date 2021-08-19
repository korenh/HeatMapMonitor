import Plot from 'react-plotly.js'


export default function MainPlot({ dataDT, dtLabels, setSubImg, url, setDate, setSensor, validImage }) {

    const plotLayoutDT = {
        width: window.innerWidth - 300, height: window.innerHeight * 0.9, margin: { l: 150, r: 10, b: 25, t: 25, pad: 0 }, shapes: dtLabels,
        paper_bgcolor: '#F5F5F5', plot_bgcolor: '#F5F5F5', xaxis: { color: 'black' }, yaxis: { color: 'black' }
    }

    const get_image = (p) => {
        setDate(p.points[0].y)
        setSensor(p.points[0].x)
        url = `${url}/image/${p.points[0].y}/${p.points[0].y}_${p.points[0].x.toString().padStart(4, 0)}.png`
        if (validImage(url)) {
            setSubImg(url)
        }
    }

    return <Plot data={dataDT} layout={plotLayoutDT} onClick={p => get_image(p)} />
}

