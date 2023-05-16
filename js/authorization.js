import Alert from './export/Alert.js';
import { findUser, isAdmin, getFullInfo } from './export/UserControll.js';

let authEmail = document.getElementById('auth-email');
let authPassword = document.getElementById('auth-password');

document.getElementById('hide-auth-password').addEventListener('click', function () {
    if (this.checked) {
        authPassword.setAttribute('type', 'text');
    } else {
        authPassword.setAttribute('type', 'password');
    }
});


function validateAuthForm() {
    if (authEmail.value.trim().length == 0 || !authEmail.value.match(/\S+@\S+\.\S+/)
                                           || authPassword.value.trim().length == 0) {

        new Alert('Щось пішло не так! Спробуйте ще раз').show();
        return false;
    }

    return true;
}

let authForm = document.getElementById('auth-form');
let loading = document.querySelector('.loading');

document.getElementById('auth-button').addEventListener('click', (event) => {
    event.preventDefault();

    if (!validateAuthForm()) return;

    let jsonUserData = {};
    new FormData(authForm).forEach((value, key) => jsonUserData[key] = value);

    findUser(jsonUserData, ['email', 'password']).then(async (answer) => {
        if (answer) {
            loading.style.display = 'block';
            await getFullInfo(jsonUserData).then(async (fullInfo) => {
                delete fullInfo.password;
                localStorage.setItem('currentUser', JSON.stringify(fullInfo));
                await isAdmin(fullInfo).then((admin) => localStorage.setItem('isAdmin', admin));
            });
            loading.style.display = 'none';

            let success = new Alert('Вхід успішно виконано!');
            success.onclose(() => window.location.href = '../index.html');
            success.show();
        } else {
            let fail = new Alert('Зареєструйтеся, перш ніж виконати вхід!');
            fail.onclose(() => window.location.href = '../pages/registration.html');
            fail.show(); 
        }
    });
});
