const listOfArticles = [
    {
        id: 'A1',
        title: 'Нові правила перетину кордонів України - тести, самоізоляція, знижки',
        img: '../images/lab-worker.jpg',
        text: 'З 00:00 24 березня 2021 року вступили в дію нові правила перетину кордонів України. \
        Відтепер усі громадяни України, хто повертається з-за кордону з будь-якої країни, мусять пройти \
        14-денну обсервацію / самоізоляцію шляхом встановлення в аеропорту моб.додатку "Вдома", або \
        пройти ПЛР - тестування на Covid - 19.',
        date: new Date(2021, 3, 23)
    },

    {
        id: 'A2',
        title: 'Новий сучасний тренд подорожей - set-jetting',
        img: '../images/set-jetting.jpg',
        text: 'Чи вам відомо, що велика частка людей бронюють поїздки \
        до пункту призначення, побачивши його у фільмі або серіалі? Популярність таких подорожей щомісяця \
        збільшується, бо бажання зануритися у “контекст” фільму зростає, стає мрією, ідеєю відпочинку, бажанням, \
        яке живе разом з тобою і кличе діяти...Set - jetting або ж поїздки в місця зйомок улюблених фільмів \
        та серіалів - це тренд 2023 року у світі подорожей, що набирає обертів і дуже часто визначає напрямок. \
        Цікава ідея, правда ? Якщо вона вам до душі - зверніть увагу на топ - 8 місць по всьому світу, де відбувалися зйомки \
        відомих кінострічок.За вами вибір місця, а ми вам допоможемо',
        date: new Date(2022, 7, 16)
    },

    {
        id: 'A3',
        title: 'Made in Italy або як вибрати якісну італійську продукцію',
        img: '../images/italy-food.jpg',
        text: 'Італійська продукція відома по всьому світу своєю високою якістю. \
        Якщо Ви шукаєте ідеальний сувенір з Італії - в тому числі і кулінарні, щоб порадувати ваших близьких, \
        то потрібно звернути увагу на кілька важливих моментів.',
        date: new Date(2023, 9, 3)
    },

    {
        id: 'A4',
        title: 'Авіаквитки. Шукаєш як заощадити?',
        img: '../images/airtickets.jpg',
        text: 'Авіапереліт - зручний і швидкий спосіб пересування. Кожного, хто планує свою подорож, цікавить, \
        як заощадити на авіаквитках.Люди, які регулярно літають, вже з досвіду знають, як купити квиток дешевше. \
        І з часом у кожного формується свій підхід, як заощадити на покупці авіаквитків .Ми дамо вам декілька порад, \
        як не розоритися на перельоті. Використовуючи нижчеописані хитрощі, можна заощадити бюджет для більш \
        приємних витрат у відпустці.',
        date: new Date(2023, 10, 24)
    }
]

let articles = alasql('SELECT * FROM ? ORDER BY date DESC', [listOfArticles]);

function getNewsMarkup() {
    let markups = [];

    let first = true;
    for (const article of articles) {
        markups.push(
            `<div class="news-item ${first ? 'selected-news' : ''}" onclick="clickTitleHandler(this)" id="${article.id}">
                <div class="news-date">${article.date.toLocaleString('default', { month: 'short', day: 'numeric' })}</div>
                <div class="news-title">${article.title}</div>
                <span class="open-close">+</span>
            </div>
            <div class="news-content">${article.text}</div>`
        );

        if (first) first = false; 
    }

    return markups;
}


let newsBlock = document.querySelector('aside');
newsBlock.innerHTML = getNewsMarkup().join(' ');

let newsTitles = document.querySelectorAll('#news aside > .news-item') 

function clickTitleHandler(newsItem) {
    let displayMode = window.getComputedStyle(document.querySelector('.main-news')).getPropertyValue('display');

    newsTitles.forEach((element) => {
        element.classList.remove('selected-news');
    });

    newsItem.classList.toggle('selected-news');

    if (displayMode == 'none') {
        let panel = newsItem.nextElementSibling;

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.classList.remove('active');
            newsItem.querySelector('.open-close').textContent = '+';
        } else {
            panel.classList.add('active');
            panel.style.maxHeight = panel.scrollHeight + "px";
            newsItem.querySelector('.open-close').textContent = '-';
        }
    }

    let art = articles.find((element) => element.id == newsItem.id);

    document.querySelector('.main-news').innerHTML = 
        `<h3>${art.title}</h3>
        <img src="${art.img}">
        <p>${art.text}</p>
        <a class="read-more" href="">Читати далі...</a>
        <div class="date">${art.date.toLocaleString()}</div>`;
    
};

window.addEventListener('resize', () => {
    let displayMode = window.getComputedStyle(document.querySelector('.main-news')).getPropertyValue('display');

    document.querySelectorAll('.news-content').forEach((element) => {
        if (displayMode != 'none') {
            element.style.maxHeight = null;
            element.classList.remove('active');
            element.previousElementSibling.querySelector('.open-close').textContent = '+';
        } else if (element.previousElementSibling.matches('.selected-news')) {
            element.classList.add('active');
            element.style.maxHeight = element.scrollHeight + "px";
            element.previousElementSibling.querySelector('.open-close').textContent = '-';
        }
    });
});


clickTitleHandler(newsTitles[0]);

// -------------------------------------------

// Float adverisement 
let floatAd = document.querySelector('.float-advert');
let isInCorner = false;

function floatAdHandler() {
    if (window.scrollY / document.scrollingElement.scrollHeight >= 0.3) {
        floatAd.classList.add('float-advert-in-corner');
        isInCorner = true;
    }
}

window.addEventListener('scroll', floatAdHandler);
