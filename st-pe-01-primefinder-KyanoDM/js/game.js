"use strict";

window.addEventListener("load", initialize);
window.addEventListener('resize', updateVisibility);

let amountOfPrimeNumbers = 0;
let runFirstTime = true;
let maxPrimeNumbers;
let playAgainButton;

function initialize() {
    const gameDiv = document.querySelector("#gameDiv");
    gameDiv.innerHTML = "";
    createSquares(gameDiv);
    if (amountOfPrimeNumbers === 0) {
        playAgain();
    }
    maxPrimeNumbers = amountOfPrimeNumbers;
    primeNumbersLeft();
    updateVisibility();
    playAgainButton = document.querySelector("#playAgainButton");
    playAgainButton.addEventListener("click", playAgain);
}

function createSquares(gameDiv) {
    let rowDiv;
    for (let i = 0; i < 20; i++) {
        if (i % 5 === 0) {
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row", "justify-content-center");
            gameDiv.appendChild(rowDiv);
        }

        const square = document.createElement("div");
        square.classList.add("square", "btn-outline-info");
        square.addEventListener("click", clickSquare);
        const randomNumber = generateRandomNumber();

        square.innerText = randomNumber;
        rowDiv.appendChild(square);
        if (isPrime(randomNumber)) {
            amountOfPrimeNumbers++;
        }
    }
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 101) + 1;
}

function isPrime(number) {
    if (number < 2) return false;
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) return false;
    }
    return true;
}

function clickSquare(event) {
    if (isPrime(event.target.innerText)) {
        event.target.classList.remove("btn-outline-info");
        event.target.classList.add("btn-success", "square-succes");
        event.target.style.pointerEvents = "none";
        amountOfPrimeNumbers--;
        primeNumbersLeft();
    } else {
        wrongNumber(event.target.innerText);
        event.target.style.pointerEvents = "none";
        event.target.classList.add("btn-danger", "square-danger");
    }
}

function primeNumbersLeft() {
    const primeNumbersLeft = document.querySelector("#primeNumbersLeft");
    if (amountOfPrimeNumbers === 0) {
        primeNumbersLeft.innerText = "Alle priemgetallen zijn gevonden!";
        makeNonSelectedSquaredRed();
        playAgainButton.classList.remove("hidden");
    } else if (amountOfPrimeNumbers === 1) {
        primeNumbersLeft.innerText = "Er is nog 1 priemgetal over";
    } else {
        primeNumbersLeft.innerText = (`Er zijn nog ${amountOfPrimeNumbers} priemgetallen over`);
    }
    loadProgressBar();
}

function loadProgressBar() {
    const progressBar = document.querySelector("#progressBar");

    let progressValue = ((maxPrimeNumbers - amountOfPrimeNumbers) / maxPrimeNumbers) * 100;

    progressBar.setAttribute("aria-valuenow", progressValue);
    progressBar.style.width = progressValue + "%";

    if (runFirstTime) {
        progressBar.setAttribute("aria-valuemax", maxPrimeNumbers);
        progressBar.setAttribute("aria-valuemin", 0);
        runFirstTime = false;
    }
}

function wrongNumber(n) {
    let msg;
    let deviders = findDeviders(n);
    msg = `Het getal ${n} is geen priemgetal. Het heeft ${deviders.length} delers: ${deviders.join(", ")}`;
    makeToast(msg);
    fillP(msg);
}

function findDeviders(n) {
    let deviders = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            deviders.push(i);
        }
    }
    return deviders;
}

function makeToast(msg) {
    const toastTemplate = `
    <div class="toast show mb-3" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
        <strong class="me-auto">Fout!</strong>
        <small></small>
        <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
         <span aria-hidden="true"></span>
        </button>
    </div>
    <div class="toast-body">
        ${msg}
        </div>
    </div>
    `;
    const toastContainer = document.getElementById('toast-container');
    toastContainer.insertAdjacentHTML('beforeend', toastTemplate);

    setTimeout(() => {
        const toast = document.querySelector('.toast');
        if (toast) {
            toast.remove();
        }
    }, 8000);
}

function fillP(msg) {
    const wrongNumber = document.querySelector("#wrongNumber");
    console.log(msg);
    wrongNumber.innerHTML = msg;
}

function clearToasts() {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => toast.remove());
}

function playAgain() {
    runFirstTime = false;
    playAgainButton.classList.add("hidden");
    amountOfPrimeNumbers = 0;
    clearToasts();
    initialize();
}

function makeNonSelectedSquaredRed() {
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
        if (!square.classList.contains("square-succes")) {
            square.classList.remove("btn-outline-info");
            square.classList.add("btn-danger", "square-danger");
            square.style.pointerEvents = "none";
        }
    });
}

// The updateVisibility function to control the display
function updateVisibility() {
    const screenWidth = window.innerWidth;
    const wrongAnswer = document.querySelector('#wrongNumber');
    const toastContainer = document.getElementById('toast-container');

    if (screenWidth <= 500) {
        // Show wrongAnswer and hide toast on small screens
        if (wrongAnswer) {
            wrongAnswer.style.display = 'block';
        }
        if (toastContainer) {
            toastContainer.style.display = 'none';
        }
    } else {
        // Hide wrongAnswer and show toast on larger screens
        if (wrongAnswer) {
            wrongAnswer.style.display = 'none';
        }
        if (toastContainer) {
            toastContainer.style.display = 'flex'; // or 'block', depending on your layout
        }
    }
}

// Initialize visibility on page load and on window resize
updateVisibility();
