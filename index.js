import menuArray from "./menuArray.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// variables
let customersOrder = []
const payForm = document.getElementById('pay-form')

// Event Listeneres
document.addEventListener("click", function (e) {
    if (e.target.dataset.add) {
        addItemToTotal(e.target.dataset.add)
    }
    if (e.target.dataset.remove) {
        removeItemFromTotal(e.target.dataset.remove)
    }
    if (e.target.classList.contains('complete-order-btn')) {
        document.getElementById("pay-modal").style.display = "block"
    }
    if (!e.target.closest('#pay-modal') && !e.target.classList.contains('complete-order-btn')) {
        document.getElementById("pay-modal").style.display = "none"
    }
})

payForm.addEventListener('submit', submitOrder)

// Functions
function renderMenu() {
    const menu = menuArray
        .map(menuItem => {
            const { name, ingredients, id, price, emoji } = menuItem
            
            return `
                    <div class="item-container">
                        <p class="emoji-img">${emoji}</p>
                        <div class="item-txt-container">
                            <h2 class="item-name">${name}</h2>
                            <p class="item-toppings">${ingredients.join(", ")}</p>
                            <h3 class="item-price">$${price}</h3>
                        </div>
                        <button class="add-item-btn" data-add="${id}">+</button>
                    </div>
            `
    }).join("")
    document.getElementById("items-section").innerHTML = menu
}

function addItemToTotal(itemId) {
    document.getElementById('order-done').classList.add('hidden')
    const targetItemObj = menuArray.filter((menuItem) => menuItem.id.toString() === itemId)[0]
    customersOrder.push({ name: targetItemObj.name, price: targetItemObj.price, id: uuidv4()})
    renderChosenItems()
    renderTotalPrice()
}

function removeItemFromTotal(itemId) {
    customersOrder = customersOrder.filter(item => item.id !== itemId)
    renderChosenItems()
    renderTotalPrice()
}

function renderChosenItems() {
    if (customersOrder.length < 1) {
        document.getElementById('customers-order-container').classList.add('hidden')
    } else {
        document.getElementById('customers-order-container').classList.remove('hidden')
    }
    const customersOrderHTML = customersOrder.map(function (item) {
        return `
        <div class="order-item">
            <h2>${item.name}</h2>
            <button class="remove" data-remove="${item.id}">remove</button>
            <h3 class="order-price">$${item.price}</h3>
        </div>
        `
    }).join('')
    document.getElementById('order-container').innerHTML = customersOrderHTML
}

function renderTotalPrice() {
    let total = 0
    customersOrder.forEach((item) => (total += item.price))
    document.getElementById("total-price").innerHTML = "$" + total
}

function submitOrder(e) {
    e.preventDefault()

    const orderDoneEl = document.getElementById("order-done")
    const firstName = e.target[0].value.split(" ")[0]

    customersOrder = []
    document.getElementById("pay-modal").style.display = "none"
    document.getElementById("customers-order-container").classList.add("hidden")
    orderDoneEl.classList.remove("hidden")

    orderDoneEl.innerHTML = `<h1>Thank you ${firstName}, Your order is on its way!</h1>`

    document.getElementById("name").value = ""
    document.getElementById("card-number").value = ""
    document.getElementById("cvv").value = ""
}

// Rendering the Menu
renderMenu()