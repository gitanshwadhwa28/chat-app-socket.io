const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('#message')
const $messageFormButton = $messageForm.querySelector('#submit')
const $locationButton = document.getElementById('location')
const $messages = document.getElementById('messages')

const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML

socket.on('Message', (message) => {

    const html = Mustache.render(messageTemplate, { message: message.text, messageTime: moment(message.currTime).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)

    console.log(message)
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, { url: message.text, locationMessageTime: moment(message.currTime).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(message)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled');

    socket.emit('messageUpdate', e.target.elements.message.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) {
            const html = Mustache.render(messageTemplate, { message: error })
            $messages.insertAdjacentHTML('beforeend', html)
            return console.log(error)
        }
        console.log("Delivered")
    });
})

$locationButton.addEventListener('click', () => {

    $locationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        return alert("eat shit");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', position.coords.longitude, position.coords.latitude, (message) => {
            $locationButton.removeAttribute('disabled')
            console.log(message)
        });
    })
})