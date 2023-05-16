import { TOURS_API_KEY, API_KEY, removeTour } from './export/ToursControll.js'
import Alert from './export/Alert.js'

let cardsContainer = document.querySelector(".cards");
let moreCardsBtn = document.getElementById('get-more-cards');
let recentlyViewedContainer = document.getElementById('recently-viewed');
let pagination = document.querySelector('.pagination');

let isAdmin = JSON.parse(localStorage.getItem('isAdmin'));


// Get n random elements from array
function randomChoice(array, n) {
	let copy = [...array];
	let shuffled = copy.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

// Get an array of strings that represent cards in HTML markup
function getCardsArray(cardObjects) {
	let cards = []

	for (let element of cardObjects) {
		let isChecked;
		try {
			isChecked = JSON.parse(localStorage.getItem('currentUser')).addedTours.includes(element.id.toString());
		} catch {
			isChecked = JSON.parse(localStorage.getItem('addedTours')).includes(element.id.toString());;
		}

		cards.push(
			`<div class="card" data-discount="${element.discount}" id="TOUR${element.id}">
                <figure>
                    <img src=${element.imageSource}>
                    <figcaption>Від ${element.price.toLocaleString()}₴</figcaption>
                </figure>

                <div class="description">
                    <h3>${element.title}</h3>
                    <p class="stars">${element.stars}</p>
                    <div class="tour-info">
                        <img class="icons" src="../images/calendar-alt.svg" alt="Календар">
                        <a>${element.tourInfo[0]}</a>
                        <img class="icons" src="../images/map-pin.svg" alt="Карта">
                        <a>${element.tourInfo[1]}</a>
                        <img class="icons" src="../images/globe.svg" alt="Глобус">
                        <a>${element.tourInfo[2]}</a>
                    </div>
                    <p>${element.description}</p>

                    <details>
                        <summary>Детальніше</summary>
                        ${element.details}
                    </details>
                    <input type="checkbox" class="add-to-shopping" value="${element.id}" onclick="checkboxClickHandler(this)" ${isChecked ? 'checked' : ''}></input>
				</div>

				
				${isAdmin ? 
					`<div class="ctrl-btns">
						<button class="change-card-btn" onclick="changeCard(this)">Змінити</button>
						<button class="delete-card-btn" onclick="deleteCard(this)">Видалити</button>
					</div>` : ''}
				

                ${element.discount ? '<img class="discount" src="../images/discount.png"></img>' : ''}
            </div>`
		);
	}

	return cards;
}


// Loading
let cardObjects;
let loaded = sessionStorage.getItem('loaded');
let loading = document.querySelector('.opaque-loading');


if (loaded == undefined || !JSON.parse(loaded)) {
	await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}/latest`, {
		headers: { 'X-Master-Key': API_KEY }
	}).then((response) => response.json()).then((data) => cardObjects = data.record);

	sessionStorage.setItem('loaded', true);
} else {
	cardObjects = JSON.parse(localStorage.getItem('cardsObjArray'));
}

localStorage.setItem('cardsObjArray', JSON.stringify(cardObjects));


// Show more cards
let cards = getCardsArray(cardObjects);
let numberOfCards = 3;
let idx = 0;

// Random cards in 'Recently viewed'
let chosen = randomChoice(cards, cards.length - 3);

recentlyViewedContainer.innerHTML += chosen.slice(idx, idx + numberOfCards).join(' ');
idx += numberOfCards;

moreCardsBtn.addEventListener('click', () => {
	recentlyViewedContainer.innerHTML += chosen.slice(idx, idx + numberOfCards).join(' ');

	if (idx + numberOfCards >= chosen.length) {
		moreCardsBtn.style.display = 'none';
		return;
	}

	idx += numberOfCards;
});


// Pagination ----------------------------------------------------------------

let numberOfPages = Math.ceil(cards.length / numberOfCards);

function showPagination(numberOfPages) {
	let paginationStr = '<button id="backward"></button>';

	for (let i = 1; i <= numberOfPages; i++) {
		paginationStr += `<input type="radio" name="pages" id="page${i}" value="${i}" ${i == 1 ? 'checked' : ''}>`;
	}

	paginationStr += '<button id="forward"></button>';

	pagination.style.display = 'flex';
	pagination.innerHTML = paginationStr;
}

showPagination(numberOfPages);

let currentPage = 0;

function setCurrentPage(cards) {
	cardsContainer.innerHTML = cards.slice(currentPage * numberOfCards, (currentPage + 1) * numberOfCards).join(' ');
	document.getElementById(`page${currentPage + 1}`).checked = true;
}

setCurrentPage(cards)

pagination.addEventListener('click', (event) => {
	if (event.target.id == 'backward') {
		currentPage--;
		if (currentPage <= 0) currentPage = 0;
	}
	else if (event.target.id == 'forward') {
		currentPage++;
		if (currentPage > numberOfPages - 1) currentPage = numberOfPages - 1;
	}
	else {
		let page = event.target.value - 1;
		if (!isNaN(page)) currentPage = page;
	}

	setCurrentPage(cards);
	cardsContainer.scrollIntoView({ behavior: 'smooth' });
});


// Create an AD banner

const bannerObj = {
	text: 'Унікальна пропозиція, знижка 30% на найпопулярніші тури!',
	startDate: new Date(),
	duration: 7
};

let adBanner = document.createElement('section');
adBanner.classList.add('ad-banner');

let endDate = new Date(bannerObj.startDate);
endDate.setDate(endDate.getDate() + bannerObj.duration);

adBanner.innerHTML = `<div>
                         <h2>${bannerObj.text}</h2>
                         <p id="small-text">Пропозиція діє з ${bannerObj.startDate.toLocaleDateString()} по ${endDate.toLocaleDateString()} включно</p>
                      </div>
                      <img src="../images/tourists.png">`;

document.querySelector('.search-result').after(adBanner);


// Admin change card btn
window.changeCard = function (button) {
	let card = button.closest('.card');
	let tourID = parseInt(card.id.replace('TOUR', ''));
	let tour = cardObjects.find((element) => element.id == tourID);
	sessionStorage.setItem('processedTour', JSON.stringify(tour));

	window.location.href = 'admin-panel.html';
}

// Admin delete card btn

window.deleteCard = function (button) {
	let alarm = new Alert('Ви впевнені, що хочете видалити цей тур?', null, 
		`<div style="display: flex; justify-content: center; flex-wrap: wrap;">
			<button style="width: 100px; margin: 10px;" onclick="answerYes()">Так</button>
			<button style="width: 100px; margin: 10px;" onclick="answerNo()">Ні</button>
		</div>`
	);

	window.answerNo = () => alarm.close();
	window.answerYes = async () => {
		let card = button.closest('.card');
		let tourID = parseInt(card.id.replace('TOUR', ''));
		let loading = document.querySelector('.loading');
		console.log(tourID);

		alarm.close();
		loading.style.display = 'block';

		let toursArray = await removeTour(tourID);
		localStorage.setItem('cardsObjArray', JSON.stringify(toursArray));

		loading.style.display = 'none';
		location.reload();

		try {
			let currentUser = JSON.parse(localStorage.getItem('currentUser'));
			currentUser.addedTours = currentUser.addedTours.filter(element => element != tourID);
			localStorage.setItem('currentUser', JSON.stringify(currentUser));
		} catch {
			let addedTours = JSON.parse(localStorage.getItem('addedTours'));
			addedTours = addedTours.filter(element => element != tourID);
			localStorage.setItem('addedTours', JSON.stringify(addedTours));
		}
	}

	alarm.show();
}


// Added tours
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let addedToursId = (currentUser == null) ? JSON.parse(localStorage.getItem('addedTours')) : currentUser.addedTours;
let counter = document.querySelector('.counter');

window.checkboxClickHandler = function (checkbox) {
	if (checkbox.checked) {
		addedToursId.push(checkbox.value);
	} else {
		addedToursId = addedToursId.filter((e) => e != checkbox.value);
	}

	try {
		currentUser.addedTours = addedToursId;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	} catch {
		localStorage.setItem('addedTours', JSON.stringify(addedToursId));
	}

	if (addedToursId.length != 0) {
		counter.style.display = 'block';
		counter.textContent = addedToursId.length;
	} else {
		counter.style.display = 'none';
	}
}


// Country options
function setCountriesByRegion(region = 'Усі') {
	let options = '<option value="Усі">Усі</option>';
	let countriesSet = new Set();

	for (const card of cardObjects) {
		if (card.region != region && region != 'Усі') continue;

		for (const countryName of card.country) {
			countriesSet.add(countryName);
		}
	}

	for (const countryName of countriesSet) {
		options += `<option value="${countryName}">${countryName}</option>`;
	}

	document.getElementById('country').innerHTML = options;
}

setCountriesByRegion('Усі');


document.getElementById('region').addEventListener('change', function () {
	setCountriesByRegion(this.value);
});


// ----------------------------------------------------------------------------

// Searching
let selectedCards = [...cardObjects];

document.querySelector('.search-result').addEventListener('click', (event) => {
	let el = event.target;
	if (!el.hasAttribute('id')) return;
	let searchingOptions = [];

	for (let option of document.querySelectorAll('.result-item > input, .result-item > select')) {
		if (option.value == 'Усі') continue;

		switch (option.id) {
			case 'date':
				if (option.value != '') searchingOptions.push(`MONTH(date) = ${new Date(option.value).getMonth() + 1}`);
				break;
			case 'country':
				searchingOptions.push(`"${option.value}" IN country`);
				break;
			case 'region':
				searchingOptions.push(`region = "${option.value}"`);
				break;
		}
	}

	currentPage = 0;

	selectedCards = alasql('SELECT * FROM ? ' + (searchingOptions.length != 0 ? 'WHERE ' + searchingOptions.join(' AND ') : ''), [cardObjects])

	if (selectedCards.length == 0) {
		cardsContainer.innerHTML = '<h3 style="font-style: italic;">Вибачте, тури не було знайдено...</h3>';
		cardsContainer.style.textAlign = 'center';
		pagination.style.display = 'none';
	} else {
		cards = getCardsArray(selectedCards);

		numberOfPages = Math.ceil(cards.length / numberOfCards);
		showPagination(numberOfPages);
		setCurrentPage(cards);

		cardsContainer.style.textAlign = 'left';
		pagination.style.display = 'flex';
	}

	updateChartsData();
});

// Sorting
let sortingOptions = [];

const priceFrom = document.getElementById('price-from');
const priceTo = document.getElementById('price-to');

let sortByPrice = false;
let sortUpDown = document.getElementById('sort-up-down');


document.getElementById('sorting').addEventListener('click', (event) => {
	let el = event.target;

	if (el.tagName.toLowerCase() != 'button') return;

	if (el.id.startsWith('sort'))
		el.classList.toggle('is-checked');

	let toggleElement = (value) => {
		if (el.matches('.is-checked')) {
			sortingOptions.push(value);
		} else {
			var index = sortingOptions.indexOf(value);
			if (index > -1) sortingOptions.splice(index, 1);
		}
	};

	let order = (sortUpDown.checked) ? 'DESC' : 'ASC';

	switch (el.id) {
		case 'sort-name':
			toggleElement('LOWER(title)');
			break;

		case 'sort-price':
			sortByPrice = !sortByPrice;
			let priceRange = document.querySelector('.price-range');
			priceRange.style.display = el.matches('.is-checked') ? 'flex' : 'none';
			break;

		case 'sort-rating':
			toggleElement('stars');
			break;

		default:
			sortingOptions = [];
	};

	if (el.matches('.price-range > button') || sortByPrice)
		selectedCards = alasql(`SELECT * FROM ? WHERE price BETWEEN ${priceFrom.value} AND ${priceTo.value}` + (sortingOptions.length != 0 ? ` ORDER BY ${sortingOptions.join(', ')}` + order : ''), [cardObjects]);
	else if (sortingOptions.length == 0)
		selectedCards = [...cardObjects];
	else
		selectedCards = alasql(`SELECT * FROM ? ORDER BY ${sortingOptions.join(', ')} ` + order, [cardObjects]);


	if (selectedCards.length == 0) {
		cardsContainer.innerHTML = '<h3 style="font-style: italic;">Вибачте, тури не було знайдено...</h3>';
		cardsContainer.style.textAlign = 'center';
		pagination.style.display = 'none';
	} else {
		numberOfPages = Math.ceil(selectedCards.length / numberOfCards);
		cards = getCardsArray(selectedCards);

		showPagination(numberOfPages);
		setCurrentPage(cards);

		cardsContainer.style.textAlign = 'left';
		pagination.style.display = 'flex';
	}

	updateChartsData();
});


sortUpDown.addEventListener('click', function () {
	let order = (sortUpDown.checked) ? 'DESC' : 'ASC';

	if (sortByPrice)
		selectedCards = alasql(`SELECT * FROM ? WHERE price BETWEEN ${priceFrom.value} AND ${priceTo.value}` + (sortingOptions.length != 0 ? ` ORDER BY ${sortingOptions.join(', ')} ` + order : ''), [cardObjects]);
	else if (sortingOptions.length == 0)
		selectedCards = [...cardObjects];
	else
		selectedCards = alasql(`SELECT * FROM ? ORDER BY ${sortingOptions.join(', ')} ` + order, [cardObjects]);

	numberOfPages = Math.ceil(selectedCards.length / numberOfCards);
	cards = getCardsArray(selectedCards);

	showPagination(numberOfPages);
	setCurrentPage(cards);

	updateChartsData();
});


let maxPrice = alasql('VALUE OF SELECT MAX(price) FROM ?', [cardObjects]);
priceFrom.max = priceTo.max = priceTo.value = maxPrice;


// Count functions

function countPrices() {
	const prices = [0, 10_000, 25_000, 50_000, 75_000];

	let res = [];
	for (let i = 0; i < prices.length - 1; i++) {
		let count = alasql(`VALUE OF SELECT COUNT(*) FROM ? WHERE price BETWEEN ${prices[i]} AND ${prices[i + 1]}`, [selectedCards]);
		res.push(count);
	}

	return res;
}

function countRegions() {
	let res = [];
	for (let reg of regions) {
		let count = alasql(`VALUE OF SELECT COUNT(*) FROM ? WHERE region = "${reg}"`, [selectedCards]);
		res.push(count);
	}

	return res;
}

alasql.fn.getRating = function (rateString) {
	return rateString.split(' ').at(-1);
}

function countStars() {
	let res = [];
	for (let s = 1; s <= 5; s++) {
		let count = alasql(`VALUE OF SELECT COUNT(*) FROM ? WHERE getRating(stars) = "${s}.0"`, [selectedCards]);
		res.push(count);
	}

	return res;
}

// Charts
const canvas = document.getElementById('charts');
const ctx = canvas.getContext('2d');

function updateChartsData() {
	pricesChartData.data.datasets[0].data = countPrices();
	regionsChartData.data.datasets[0].data = countRegions();
	ratingChartData.data.datasets[0].data = countStars();

	currentChart.update();
}

let pricesChartData = {
	type: 'bar',
	data: {
		labels: ['0-10 000₴', '10 000₴-25 000₴', '25 000₴-50 000₴', '50 000₴-75 000₴'],
		datasets: [{
			label: 'Кількість турів по цінових діапазонах',
			data: countPrices(),
			backgroundColor: [
				'rgba(54, 162, 235, 0.5)',
				'rgba(153, 102, 255, 0.5)',
				'rgba(69, 255, 87, 0.5)',
				'rgba(255, 128, 128, 0.5)'
			],
			borderRadius: 10,
		}]
	},
	options: {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				max: Math.max(...countPrices()) + 2,
			}
		}
	}
};

const regions = [
	'Європа',
	'Азія',
	'Африка',
	'Північна Америка',
	'Південна Америка',
	'Австралія'
];

let regionsChartData = {
	type: 'pie',
	data: {
		labels: regions,
		datasets: [{
			label: 'Кількість турів по регіону',
			data: countRegions(),
		}]
	},
	options: {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
			}
		}
	}
};

let ratingChartData = {
	type: 'line',
	data: {
		labels: ['1 зірка', '2 зірки', '3 зірки', '4 зірки', '5 зірок'],
		datasets: [{
			label: 'Кількість турів по рейтингах',
			data: countStars(),
			backgroundColor: 'rgba(255, 18, 121, 0.5)',
			cubicInterpolationMode: 'monotone',
			pointStyle: 'circle',
			pointRadius: 5,
			pointHoverRadius: 7,
			borderColor: 'rgb(255, 82, 79)'
		}]
	},
	options: {
		responsive: true,
	}
};

let currentData = Object.assign({}, pricesChartData);
let currentChart = new Chart(ctx, currentData);

document.querySelector('#statistic > div').addEventListener('click', (event) => {
	if (event.target.id == 'chart1') {
		currentChart.destroy();
		currentData = Object.assign({}, pricesChartData);
	} else if (event.target.id == 'chart2') {
		currentChart.destroy();
		currentData = Object.assign({}, regionsChartData);
	} else if (event.target.id == 'chart3') {
		currentChart.destroy();
		currentData = Object.assign({}, ratingChartData);
	} else {
		return;
	}

	currentChart = new Chart(ctx, currentData);
})

// Hide loading
loading.style.display = 'none';
