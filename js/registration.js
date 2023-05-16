import Alert from './export/Alert.js';
import { findUser, addNewUser, isAdmin } from './export/UserControll.js';

let passwordInput = document.getElementById('user-password');
let passwordRepeat = document.getElementById('password-repeat');
let passwordRequirements = document.querySelector('.password-requirements');
let userEmail = document.getElementById('user-email');


passwordInput.addEventListener('keyup', function () {
    let child = (numberOfChild) => {
        return passwordRequirements.querySelector(`li:nth-child(${numberOfChild})`)
    };

    if (this.value.match(/[a-z]/g) && this.value.match(/[A-Z]/g))
        child(1).classList.add('valid');
    else
        child(1).classList.remove('valid');
    
    if (this.value.match(/[0-9]/g))
        child(2).classList.add('valid');
    else
        child(2).classList.remove('valid');

    if (this.value.length >= 8)
        child(3).classList.add('valid');
    else
        child(3).classList.remove('valid');
});

document.getElementById('hide-password').addEventListener('click', function () {
    if (this.checked) {
        passwordInput.setAttribute('type', 'text');
        passwordRepeat.setAttribute('type', 'text');
    } else {
        passwordInput.setAttribute('type', 'password');
        passwordRepeat.setAttribute('type', 'password');
    }
});


// Server

let regForm = document.querySelector('.r-form');

function validateRegForm() {
    let alertSize = [600, 100];

    if (document.getElementById('user-name').value.trim().length == 0) {
        new Alert('Введіть ім\'я користувача, це обов\'язкове поле!', alertSize).show();
        return false;
    } else if (userEmail.value.trim().length == 0) {
        new Alert('Введіть вашу електронну пошту, це обов\'язкове поле!', alertSize).show();
        return false;
    } else if (!userEmail.value.match(/\S+@\S+\.\S+/)) {
        new Alert('Електронна пошта не валідна! Спробуйте ще раз', alertSize).show();
        return false;
    } else if (!passwordInput.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g)) {
        new Alert('Пароль не відповідає вимогам! Спробуйте ще раз', alertSize).show();
        return false;
    }

    return true;
}

let loading = document.querySelector('.loading');

document.getElementById('register-button').addEventListener('click', async (event) => {
    event.preventDefault();

    if (!validateRegForm()) return;

    if (passwordInput.value != passwordRepeat.value) {
        new Alert('Паролі не збігаються!', [300, 100]).show();
    } else {
        let jsonUserData = {};
        new FormData(regForm).forEach((value, key) => jsonUserData[key] = value);

        jsonUserData = {...jsonUserData, ...{
            country: 'Невказано',
            city: 'Невказано',
            phone: '+XX XXX XXX XXXX',
            profileImage: '../images/profile-icon.jpg',
            addedTours: []
        }};

        findUser(jsonUserData).then(async (answer) => {
            if (answer) 
                new Alert('Ви вже зареєстровані!', [300, 100]).show();
            else {
                loading.style.display = 'block';
                await addNewUser(jsonUserData);
                loading.style.display = 'none';

                let copyData = {...jsonUserData};
                delete copyData.password;

                localStorage.setItem('currentUser', JSON.stringify(copyData));
                isAdmin(jsonUserData).then(answer => localStorage.setItem('isAdmin', answer));

                let success = new Alert('Успішно зареєстровано!');
                success.onclose(() => window.location.href = '../index.html');
                success.show();
            }
        });
    }
});


