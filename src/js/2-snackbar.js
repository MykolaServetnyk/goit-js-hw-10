'use strict'

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector('.form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const delayInput = document.querySelector('input[name="delay"]');
    const stateRadio = document.querySelector('input[name="state"]:checked');

    const delay = parseInt(delayInput.value);
    const state = stateRadio ? stateRadio.value : '';

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    promise.then(
        (result) => {
            iziToast.show({
                message: `✅ Fulfilled promise in ${result}ms`,
                messageColor: 'white',
                backgroundColor: '#45a049',
                position: 'topRight'
            });
        },
        (error) => {
            iziToast.show({
                message: `❌ Rejected promise in ${error}ms`,
                messageColor: 'white',
                backgroundColor: 'red',
                position: 'topRight'
            });
        }
    );
});
