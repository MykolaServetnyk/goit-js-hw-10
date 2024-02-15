'use strict';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');

startButton.disabled = true;

let userSelectedDate;
let timerInterval;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = new Date(selectedDates[0]);
        const isValidDate = userSelectedDate && userSelectedDate >= new Date();

        startButton.disabled = !isValidDate;

        if (!isValidDate) {
            iziToast.show({
                message: "Please choose a date in the future",
                messageColor: 'white',
                backgroundColor: 'red',
            });
        }
    }
};

flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

function updateTimerDisplay(time) {
    const updateElement = (identifier, value) => {
        const element = document.querySelector(`[data-${identifier}]`);
        if (element) {
            element.textContent = addLeadingZero(value);
        }
    };

    updateElement('days', time.days);
    updateElement('hours', time.hours);
    updateElement('minutes', time.minutes);
    updateElement('seconds', time.seconds);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function startCountdown() {
    const now = new Date();
    let timeDifference = userSelectedDate - now;

    if (!userSelectedDate || timeDifference <= 0) {
        iziToast.show({
            message: "Please choose a date in the future",
            messageColor: 'white',
            backgroundColor: 'red',
        });
        return;
    }

    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(function () {
        const remainingTime = convertMs(timeDifference);
        updateTimerDisplay(remainingTime);

        timeDifference -= 1000;

        if (timeDifference < 0) {
            clearInterval(timerInterval);
            updateTimerDisplay(convertMs(0));
            startButton.disabled = false;
            datetimePicker.disabled = false;
        }
    }, 1000);
}

startButton.addEventListener('click', startCountdown);
