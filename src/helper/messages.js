const generateMessage = (text) => {
    return {
        text,
        currTime: new Date().getTime()
    }
}

const generateLocationMessage = (text) => {
    return {
        text,
        currTime: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}