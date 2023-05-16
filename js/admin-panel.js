import { editTour, addNewTour } from './export/ToursControll.js';


let submitBtn = document.getElementById('submit-btn');

let editMode = false;
let currentTourID = null;

document.getElementById('tour-image').addEventListener('change', function () {
    let file = this.files[0];
    let url = URL.createObjectURL(file);

    document.querySelector('.admin-form > div img').src = url;
});

if (sessionStorage.getItem('processedTour') != undefined) {
    editMode = true;
    submitBtn.textContent = 'Змінити';

    fillInAdminForm();
    currentTourID = JSON.parse(sessionStorage.getItem('processedTour')).id;
    sessionStorage.removeItem('processedTour')
}


let loading = document.querySelector('.loading');

submitBtn.addEventListener('click', async () => {
    loading.style.display = 'block';

    let adminForm = document.querySelector('.admin-form');
    let tourData = {};

    new FormData(adminForm).forEach((value, key) => tourData[key] = value);

    if (tourData.imageSource.name != '') {
        tourData.imageSource = `../images/${tourData.imageSource.name}`;
        console.log(`../images/${tourData.imageSource.name}`);
    } else {
        delete tourData.imageSource;
    }

    tourData.price = parseInt(tourData.price);

    tourData.tourInfo = [tourData.days, tourData.places, tourData.countries];
    
    delete tourData.days;
    delete tourData.places;
    delete tourData.countries;

    tourData.country = tourData.country.split(',').map((val) => val.trim());

    tourData.discount = (tourData.discount == 'on');

    let n = parseInt(tourData.stars);
    if (n > 5) n = 5;
    else if (n < 1) n = 1;

    tourData.stars =  '&#9733; '.repeat(n) + '&#9734; '.repeat(5 - n) + `${n}.0`;

    let tempTour;

    if (editMode) {
        tempTour = await editTour(currentTourID, tourData);
    } else {
        tempTour = await addNewTour(tourData);
    }

    localStorage.setItem('cardsObjArray', JSON.stringify(tempTour));

    loading.style.display = 'none';
    location.reload();
});

function fillInAdminForm() {
    let adminForm = document.querySelector('.admin-form');
    let tourData = JSON.parse(sessionStorage.getItem('processedTour'));

    let field = (name) => adminForm.querySelector(`[name="${name}"]`);

    field('title').value = tourData.title;
    adminForm.querySelector('img').src = tourData.imageSource;
    field('price').value = tourData.price;

    [field('days').value, field('places').value, field('countries').value] = tourData.tourInfo;

    field('country').value = tourData.country;
    field('discount').checked = tourData.discount;
    field('stars').value = parseInt(tourData.stars.split(' ').at(-1));

    field('description').value = tourData.description;
    field('details').value = tourData.details;
    field('date').value = tourData.date;
}
