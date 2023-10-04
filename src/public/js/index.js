const socketClient = io()

const formAdd = document.querySelector("#formAdd")
const formDelete = document.querySelector("#formDelete")
const listContainer = document.querySelector("#listContainer")

//Lista de inputs del formulario, de agregado de productos, para capturar su valores
const inputTitle = document.querySelector(".addTitle") 
const inputDescription = document.querySelector(".addDescription")
const inputCode = document.querySelector(".addCode")
const inputPrice = document.querySelector(".addPrice")
const inputStock = document.querySelector(".addStock")
const inputCategory = document.querySelector(".addCategory")
const inputThumbnail = document.querySelector(".addThumbnail")

const inputDeleteCode = document.querySelector(".deleteCode")
//

formAdd.onsubmit = (e) => {
    const title = inputTitle.value
    const description = inputDescription.value
    const code = inputCode.value
    const price = inputPrice.value
    const stock = inputStock.value
    const category = inputCategory.value
    const thumbnail = "./assets/imageNotFound.png"
    if(inputThumbnail.value){
        const thumbnail = inputThumbnail.value
    }
    socketClient.emit("addProduct" ,title, description, code, price, stock, category, thumbnail)
}

formDelete.onsubmit = (e) => {
    const code = inputDeleteCode.value
    socketClient.emit("deleteProduct", code)
}

socketClient.on("newProducts", (title, description, code, price, stock, category, thumbnail) =>{
        let productCard = document.createElement("div")
        productCard.innerHTML=`
        <div class="card" style="width: 18rem;" id="${code}">
        <img src=${thumbnail} class="card-img-top" alt=${title}>
        <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <p class="card-text">$${price}</p>
        <p class="card-text">stock: ${stock}</p>
        <p class="card-text">Code: ${code}</p>
        </div>
        </div>
        `
        listContainer.append(productCard)
})

socketClient.on("deleteCard", (code) =>{
    const cardEliminated = document.getElementById(code)
    listContainer.removeChild(cardEliminated)
})

