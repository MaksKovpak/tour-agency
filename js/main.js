(function() {
    let count = document.querySelector('.counter');

    // Get current user
    let currentUser = localStorage.getItem('currentUser');
    let addedTours = localStorage.getItem('addedTours');

    if (currentUser == undefined) {
        currentUser = null;
        localStorage.setItem('currentUser', null);
    } else {
        currentUser = JSON.parse(currentUser);
    }

    if (addedTours == undefined) {
        addedTours = [];
        localStorage.setItem('addedTours', '[]');
    } else {
        addedTours = JSON.parse(addedTours);
    }


    if (currentUser != null) {
        let openProfile = document.getElementById('open-profile');
        openProfile.href = '../pages/user-cabinet.html';
        openProfile.innerHTML = `<img class="icons big-icon profile" src="${currentUser.profileImage}">`
        addedTours = currentUser.addedTours;
    }

    if (addedTours.length != 0) {
        count.style.display = 'block';
        count.textContent = addedTours.length;
    } else {
        count.style.display = 'none';
    }

    let upButton = document.querySelector('.up-btn');

    upButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });

    function scrollHandler() {
        if (window.scrollY / document.scrollingElement.scrollHeight >= 0.5) {
            upButton.style.display = 'block';
        } else {
            upButton.style.display = 'none';
        }
    }

    window.addEventListener('scroll', scrollHandler);
}());
