const socketClient = io()
const nameWelcome = document.querySelector("#name")
const chatDiv = document.querySelector("#chat")
const form = document.querySelector("#formChat")
const formInput = document.querySelector("#formMessage")
let email, message 

Swal.fire({
    title: 'Bienvenido a ChatCode',
    input: 'email',
    inputLabel: 'Ingresa tu correo electrónico:',
    inputPlaceHolder: 'Tu correo aquí',
    confirmButtonText: 'Ingresar'
}).then(input => {
    email = input.value
    socketClient.emit("newUser", email)
    nameWelcome.innerText = `Bienvenido usuario con correo: ${email}. Empezamos a chatear con con tus amigos!`
    Swal.fire({
        icon: 'success',
        text: `Ingreso correcto con correo:: ${email}`,
        confirmButtonText: 'Continuar'
    })
})

socketClient.on("userConnected", (email) =>{
    Toastify({
        text: `${email} conectado`,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
})

socketClient.on("chat", (messages) => {
    const chat = messages.map(message => {
        return `<p>${message.email}: ${message.message}</p>`
    }).join(" ")
    chatDiv.innerHTML = chat
})

form.onsubmit = (e) => {
    e.preventDefault()
    const message = {
        email: email,
        message: formInput.value
    }
    formInput.value = ""
    socketClient.emit("message", message)
}