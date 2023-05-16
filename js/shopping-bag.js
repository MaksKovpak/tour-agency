let shoppingBag = document.getElementById('shopping-bag');

let cardsArray = JSON.parse(localStorage.getItem('cardsObjArray'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let addedToursId = (currentUser != null) ? currentUser.addedTours : JSON.parse(localStorage.getItem('addedTours'));

function getTourById(toursArray, id) {
    return toursArray.find((element) => element.id == id);
}

let additionalServices = {
    allInclusive: 2000,
    transfer: 500,
    insurance: 5000
}

const discountValue = 0.2;

function renderShopCards(addedToursId) {
    shoppingBag.innerHTML = '';
    shoppingBagMarkup = [];
    finalAmount = 0;

    for (const tourId of addedToursId) {
        let tour = getTourById(cardsArray, tourId);
        let price = tour.price;
        
        if (tour.discount) price = Math.round(price * (1 - discountValue));

        shoppingBagMarkup.push(
            `<div class="product" data-tourId="${tour.id}">
                <img src="${tour.imageSource}">
                
                <div>
                    <h3>${tour.title}</h3>
                    
                    <p>${tour.discount ? `<span class="old-price">${tour.price.toLocaleString()}₴</span> <br>` : ''} ${price.toLocaleString()}₴</p>
        
                    <div class="control-section">
                        <details>
                            <summary>Додаткові послуги</summary>
                            <ul>
                                <li><input type="checkbox" id="" value="${additionalServices.allInclusive}">All-inclusive</li>
                                <li><input type="checkbox" id="" value="${additionalServices.transfer}">Трансфер з аеропорту в готель</li>
                                <li><input type="checkbox" id="" value="${additionalServices.insurance}">Страхування</li>
                            </ul>
                        </details>
                        
                        <div class="quantity">
                            <button onclick="clickMinus(this)">-</button>
                            <input type="number" min="1" value="1" oninput="updateFinalAmount()" id="T${tour.id}">
                            <button onclick="clickPlus(this)">+</button>
                        </div>
                    </div>
                    
                    <button class="remove-item-btn">&times;</button>
                </div>
            </div>`
        );

        finalAmount += price;
    }

    shoppingBagMarkup.push(
        `<div class="final-amount">
            <h3>Загалом: ${finalAmount.toLocaleString()}₴</h3>
        </div>`
    );

    shoppingBag.innerHTML = shoppingBagMarkup.join(' ');
}

renderShopCards(addedToursId);

function clickPlus(button) {
    let input = button.previousElementSibling;
    input.stepUp();
    updateFinalAmount(input);
}

function clickMinus(button) {
    let input = button.nextElementSibling;
    input.stepDown();
    updateFinalAmount(input);
}

function updateFinalAmount() {
    let finalAmount = 0;
    for (const tourId of addedToursId) {
        let tour = getTourById(cardsArray, tourId);
        let price = tour.price;

        if (tour.discount) price = Math.round(price * (1 - discountValue));

        let quantity = document.getElementById(`T${tourId}`).value;
        finalAmount += price * quantity;
    }

    document.querySelector('.final-amount > h3').textContent = `Загалом: ${finalAmount.toLocaleString()}₴`;
}


shoppingBag.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-btn')) {
        let productId = event.target.closest('.product').getAttribute('data-tourId');
        addedToursId = addedToursId.filter((e) => e != productId);

        try {
            currentUser.addedTours = addedToursId; 
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } catch {
            localStorage.setItem('addedTours', JSON.stringify(addedToursId));
        }

        renderShopCards(addedToursId);
    }
});


function sendToursOnServer() {
    let finalOrder = {
        customer: {
            username: currentUser.username,
            email: currentUser.email
        },
        orderedTours: addedToursId
    };

    console.log(`Замовлення #${Math.round(Math.random() * 100_000)} успішно оформлено: `, finalOrder);
}

if (currentUser != null) {
    let sendButton = document.createElement('button');
    sendButton.textContent = 'Оформити замовлення';
    sendButton.onclick = sendToursOnServer;

    let finalAmount = document.querySelector('.final-amount');
    finalAmount.appendChild(sendButton);
    finalAmount.querySelector('h3').style['margin-bottom'] = '20px';
}
