const nav = document.querySelector('.nav'),
    menuTogglBtn = document.querySelector('.nav__button'),
    menuBox = document.querySelector('.menu');

const open = () => {
    menuBox.style.cssText = 'right: -1px;';
};

const close = () => {
    menuBox.style.cssText = 'right: -310px;';
};

const stickyMenu = () => {

    let scrollPosition = Math.ceil(window.scrollY / 4);

    if (scrollPosition > 10) {
        nav.classList.add('sticky-nav');
    } else {
        nav.classList.remove('sticky-nav');
    }
};

const toggleAnimations = (event) => {
    let target = event.target;

    if (!target.matches('.nav__button')) {
        close();
        menuTogglBtn.innerHTML = '☰';
        return;
    }

    target.innerHTML = target.innerHTML === '✖' ? '&#9776;' : '&#10006;';
    target.innerHTML === '✖' ? open() : close();
};

document.body.addEventListener('click', toggleAnimations);
window.addEventListener('scroll', stickyMenu);