const timerHours = document.querySelector('#timer-hours'),
    timerMinutes = document.querySelector('#timer-minutes'),
    timerSeconds = document.querySelector('#timer-seconds'),
    form = document.querySelector('form'),
    deadline = '30 September 2021';

const getTimeRemaining = (deadline) => {
    
    const dateStop = new Date(deadline).getTime(),
        dateNow = new Date().getTime(),
        timeRemaining = (dateStop - dateNow) / 1000;
    
    let seconds = Math.floor(timeRemaining % 60),
        minutes = Math.floor((timeRemaining / 60) % 60),
        hours = Math.floor(timeRemaining / 60 / 60);
    
    if (seconds < 10) { seconds = '0' + seconds; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (hours < 10)   { hours = '0' + hours; }
    return { timeRemaining, hours, minutes, seconds };
};

const updateClock = () => {
    const timer = getTimeRemaining(deadline);
  
    if (timer.timeRemaining > 0) {
  
        timerHours.textContent = timer.hours;
        timerMinutes.textContent = timer.minutes;
        timerSeconds.textContent = timer.seconds;
  
    } else if (timer.timeRemaining < 0) {
  
        clearInterval(intervalIndex);
  
        timerHours.textContent = '00';
        timerMinutes.textContent = '00';
        timerSeconds.textContent = '00';
    }
};
const intervalIndex = setInterval(updateClock, 1000);

form.addEventListener('input', event => {
    const namePattern= /[?!,.%:*(/><)_^#$@&~'}[{\-+="№;0-9]$/;
    const phonePattern = /[а-яА-ЯЁёa-zA-Z?!,%@&~'}[{:*\-)<(^$=";\s]/;
    let target = event.target;

    if (target.classList.contains('contact__input_name')) {
        target.value = target.value.replace(namePattern, '');
    }

    if (target.classList.contains('contact__input_phone')) {
        target.value = target.value.replace(phonePattern, '');
        
        if(target.value.match(/\+/)) {
            target.setAttribute('maxlength', 12);
        } else {
            target.setAttribute('maxlength', 11);
        }
    }
});

[...form].forEach(elem => {
    if(!elem.matches('INPUT')) return;

    elem.addEventListener('focus', event => {
        const target = event.target;

        if (target.matches('.contact__input_name')){
            target.previousElementSibling.style.display = 'inline-block';
        }
        if (target.matches('.contact__input_phone')){
            target.previousElementSibling.style.display = 'inline-block';
        }
    });

    elem.addEventListener('blur', event => {
        const target = event.target;

        if (target.matches('.contact__input_name')){
            target.previousElementSibling.style.display = 'none';
        }
        if (target.matches('.contact__input_phone')){
            target.previousElementSibling.style.display = 'none';
        }
    });
});
