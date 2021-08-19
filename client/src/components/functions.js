export const rangeToMinutes = (t) => {
    switch (t) {
        case '5m':
            return 5
        case '30m':
            return 30
        case '1h':
            return 60
        case '5h':
            return 300
        case '12h':
            return 720
        default:
            return 1440
    }
}


export const validImage = (url) => {
    let img = new Image()
    img.src = url
    if (img.height !== 0) {
        return true
    }
    return false
}

