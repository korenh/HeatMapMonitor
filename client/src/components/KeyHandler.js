import KeyboardEventHandler from 'react-keyboard-event-handler'


export default function KeyHandler({ setSubImg, setSensor, date, sensor, url, validImage }) {
    return <div>
        <KeyboardEventHandler
            handleKeys={['left', 'right']}
            onKeyEvent={(key, e) => {
                if (key === 'right') {
                    let image = `${url}/image/` + date + '/' + date + '_' + (parseInt(sensor) + 1).toString().padStart(4, 0) + '.png'
                    if (validImage(image)) {
                        setSubImg(image)
                    }
                    setSensor((parseInt(sensor) + 1).toString().padStart(4, 0))
                }
                if (key === 'left') {
                    let image = `${url}/image/` + date + '/' + date + '_' + (parseInt(sensor) - 1).toString().padStart(4, 0) + '.png'
                    if (validImage(url)) {
                        setSubImg(image)
                    }
                    setSensor((parseInt(sensor) - 1).toString().padStart(4, 0))
                }
            }
            } />
    </div>
}