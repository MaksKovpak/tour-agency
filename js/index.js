let modal = document.querySelector('.modal:not(#ad)');
let fixedBtn = document.querySelector('.up-btn');
let ad = document.getElementById('ad');


window.addEventListener('load', () => document.querySelector('.opaque-loading').style.display = 'none');

// Flip cards
for (const card of document.querySelectorAll('.directions-card-inner')) {
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });
}

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 1);
let expireDate = currentDate.toUTCString();

document.cookie = `username=User; expires=${expireDate}; path=/; domain=""; secure;`;

// Get cookie value by name
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Show modal
setTimeout(() => { 
    if (localStorage.getItem('subscribed') !== 'true' && getCookie('visited') !== 'true') modal.style.display = 'flex'; 
}, 5000);

// Close
document.querySelector('.modal:not(#ad) .close').addEventListener('click', () => {
    modal.style.display = 'none';
    document.cookie += 'visited=true;'
});

// Subscribe
document.getElementById('subscribe').addEventListener('click', () => {
    document.querySelector('.modal-content > div').innerHTML = `<h2>Дякуємо, що довіряєте нам!</h2>`;
    localStorage.setItem('subscribed', 'true');
});

let isClosable = false;
let canShowAd = true;

let advertisement = {
    src: 'images/ad-1.jpg',
    time: 5
};

ad.innerHTML = `<div class="modal-content">
                    <span class="close">&times;</span>
                    <img src="${advertisement.src}">
                    <p id="timer">Вікно закриється через ${advertisement.time} секунд</p>
                </div>`


let adImage = document.querySelector('div#ad .modal-content img');
let closeAdBtn = document.querySelector('.modal#ad .close');
let modalTime = document.getElementById('timer');

closeAdBtn.addEventListener('click', () => {
    if (isClosable) {
        ad.style.display = 'none';
        document.body.style.overflow = 'auto';
        isClosable = false;
        canShowAd = true;
    }
});

let time = advertisement.time;
function showAd() {
    if (!canShowAd || getCookie('visited') !== 'true') return;

    canShowAd = false;

    closeAdBtn.style.color = 'gray';
    closeAdBtn.style.cursor = 'initial';

    document.body.style.overflow = 'hidden';
    ad.style.display = 'flex';

    adImage.src = `images/ad-${Math.floor(Math.random() * 5) + 1}.jpg`;
    isClosable = false;

    let timeID = setInterval(() => {
        if (time > 0) {
            modalTime.textContent = `Вікно закриється через ${time--} секунд`;
        } else {
            modalTime.textContent = 'Ви можете закрити вікно!';
            isClosable = true;
            closeAdBtn.style.cursor = 'pointer';    
            closeAdBtn.style.color = 'black';          
        }
    }, 1000);
    
    if (time == 0) {
        clearInterval(timeID);
        time = advertisement.time;
    }
}

setInterval(showAd, 300_000);
