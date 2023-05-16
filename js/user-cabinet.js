import { USERS_API_KEY, API_KEY } from './export/UserControll.js'
import Alert from './export/Alert.js'

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let loading = document.querySelector('.loading');


async function updateUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let response = await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let usersArray = data.record.users;

    if (JSON.parse(localStorage.getItem('isAdmin'))) {
        data.record.admin = { ...data.record.admin, ...currentUser };
    } else {
        usersArray.forEach((user, index, array) => {
            if (['username', 'email'].every((key) => user[key] == currentUser[key])) {
                array[index] = { ...user, ...currentUser };
                return;
            }
        });

        data.record.users = [...usersArray];
    }

    try {
        await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(data.record)
        });
    } catch (error) {
        new Alert('Щось пішло не так :(').show();
    }
}

if (JSON.parse(localStorage.getItem('isAdmin'))) {
    let tmpBtn = document.getElementById('change-btn');
    tmpBtn.textContent = 'Перейти до адмін-панелі';
    tmpBtn.onclick = () => window.location.href = '../pages/admin-panel.html';
} else {
    document.getElementById('change-btn').addEventListener('click', async function () {
        for (const input of document.querySelectorAll('.base-info input')) {
            input.toggleAttribute('readonly');
        }

        if (this.textContent == 'Змінити') {
            this.textContent = 'Зберегти';
        } else {
            loading.style.display = 'block';
            let cabinetForm = document.querySelector('.base-info');
            let newUserData = {};

            new FormData(cabinetForm).forEach((value, key) => newUserData[key] = value);

            currentUser = { ...currentUser, ...newUserData };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            await updateUser();

            loading.style.display = 'none';
            this.textContent = 'Змінити';
        }
    });
}


document.getElementById('exit-btn').addEventListener('click', async () => {
    loading.style.display = 'block';
    await updateUser();
    currentUser = null;
    localStorage.setItem('currentUser', null);
    localStorage.setItem('isAdmin', false);
    loading.style.display = 'none';
    
    window.location.href = '../index.html';
})


const fileTypes = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    'image/x-icon'
];


document.getElementById('open-image').addEventListener('change', function () {
    let file = this.files[0];
    let reader = new FileReader();
    
    reader.onload = async function (fileLoadedEvent) {
        let url = fileLoadedEvent.target.result;
        
        if (!fileTypes.includes(file.type)) return;

        if (file.size / 1024 >= 100) {
            new Alert('Вибачте, ви не можете завантажити зображення більше ніж 100кб. Виберіть інше зображення').show();
            return;
        }

        currentUser.profileImage = url;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        document.querySelector('.profile-photo').src = url;
        let openProfile = document.getElementById('open-profile');
        openProfile.innerHTML = `<img class="icons big-icon profile" src="${url}">`;

        updateUser();
    }

    reader.readAsDataURL(file);
});


document.querySelector('#user-photo > img').src = currentUser.profileImage;

document.querySelector('.base-info').innerHTML = 
    `<div>
        <h3>Ім'я та прізвище</h3>
        <input type="text" value="${currentUser.username}" name="username" readonly></input>
    </div>
    
    <div>
        <h3>Електронна пошта</h3>
        <input type="email" value="${currentUser.email}" name="email" readonly></input>
    </div>
    
    <div>
        <h3>Номер телефону</h3>
        <input type="tel" value="${currentUser.phone}" name="phone" readonly></input>
    </div>
    <div>
        <h3>Країна</h3>
        <input type="text" value="${currentUser.country}" name="country" readonly></input>
    </div>
    
    <div>
        <h3>Місто</h3>
        <input type="text" value="${currentUser.city}" name="city" readonly></input>
    </div>
    
    <div>
        <h3>Дата народження</h3>
        <input type="date" value="${currentUser.birthday}" name="birthday" readonly></input>
    </div>`;
