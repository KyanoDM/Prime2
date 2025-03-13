"use strict";

window.addEventListener("load", initialize);
window.addEventListener('resize', updateVisibility);

let amountOfPrimeNumbers = 0, maxPrimeNumbers;
let runFirstTime = true, hardcoreMode = false;
let playAgainButton, stopButton, findButton, hardcoreButton, subwayButton;


function initialize() {
    const gameDiv = document.querySelector("#gameDiv");
    gameDiv.innerHTML = "";
    addEventListeners();
    initializeToolTips();
}

//van bootstrap
function initializeToolTips() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function addEventListeners() {
    const difficultySelectorBtns = document.querySelectorAll(".difficultySelectorBtn");
    difficultySelectorBtns.forEach(btn => {
        btn.addEventListener("click", startGame);
    });
    stopButton = document.querySelector("#stopButton");
    stopButton.addEventListener("click", stop);

    findButton = document.querySelector("#findButton");
    findButton.addEventListener("click", findOnePrimeNumber);

    hardcoreButton = document.querySelector("#hardcoreButton");
    hardcoreButton.addEventListener("click", toggleHardcoreCheckmark);

    playAgainButton = document.querySelector("#playAgainButton");
    playAgainButton.addEventListener("click", playAgain);

    subwayButton = document.querySelector("#subwayButton");
    subwayButton.addEventListener("click", toggleSubway);
}

function startGame(event) {
    const gameDiv = document.querySelector("#gameDiv");
    gameDiv.innerHTML = "";

    if (event.target.innerText === "Makkelijk") {
        createSquares(gameDiv, 10);
        while (amountOfPrimeNumbers === 0) {
            playAgain();
            createSquares(gameDiv, 10);
        }
    } else if (event.target.innerText === "Normaal") {
        createSquares(gameDiv, 20);
        while (amountOfPrimeNumbers === 0) {
            playAgain();
            createSquares(gameDiv, 20);
        }
    } else {
        createSquares(gameDiv, 40);
        while (amountOfPrimeNumbers === 0) {
            playAgain();
            createSquares(gameDiv, 40);
        }
    }
    const hardcoreInput = document.querySelector("#HardcoreSwitch");
    hardcoreMode = hardcoreInput.checked;

    maxPrimeNumbers = amountOfPrimeNumbers;
    primeNumbersLeft();
    updateVisibility();
    hideElement("#difficultySelector");
    showElement("#primeNumbersLeft");
    showElement("#progressBarContainer");
    showElement("#stopButton");
    findButton.classList.remove("disabled");
    
}

function createSquares(gameDiv, amountOfSquares) {
    let rowDiv;
    for (let i = 0; i < amountOfSquares; i++) {
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
        if (hardcoreMode) {
            makeNonSelectedPrimeNumbersOrange();
            makeNonSelectedSquaredRed();
            findButton.classList.add("disabled");
            hideElement("#stopButton");
            playAgainButton.classList.remove("hidden");
        }
    }
}

function primeNumbersLeft() {
    const primeNumbersLeft = document.querySelector("#primeNumbersLeft");
    if (amountOfPrimeNumbers === 0) {
        primeNumbersLeft.innerText = "Alle priemgetallen zijn gevonden!";
        makeNonSelectedSquaredRed();
        findButton.classList.add("disabled");
        hideElement("#stopButton");
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
    fillPWithMessage(msg);
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

function fillPWithMessage(msg) {
    const wrongNumber = document.querySelector("#wrongNumber");
    wrongNumber.innerHTML = msg;
}

function clearToasts() {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => toast.remove());
}

function playAgain() {
    runFirstTime = false;
    amountOfPrimeNumbers = 0;
    clearToasts();
    initialize();
    showElement("#difficultySelector");
    hideElement("#primeNumbersLeft");
    hideElement("#progressBarContainer");
    hideElement("#playAgainButton");
}

function makeNonSelectedSquaredRed() {
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
        if (!square.classList.contains("square-succes") && !square.classList.contains("square-warning>")) {
            square.classList.remove("btn-outline-info");
            square.classList.add("btn-danger", "square-danger");
            square.style.pointerEvents = "none";
        }
    });
}

function makeNonSelectedPrimeNumbersOrange() {
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
        if (isPrime(parseInt(square.innerText))) {
            square.classList.remove("btn-outline-info");
            square.classList.add("btn-warning", "square-warning");
            square.style.pointerEvents = "none";
        }
    });
}

function updateVisibility() {
    const screenWidth = window.innerWidth;
    const wrongAnswer = document.querySelector('#wrongNumber');
    const toastContainer = document.getElementById('toast-container');

    if (screenWidth <= 500) {
        if (wrongAnswer) {
            wrongAnswer.style.display = 'block';
        }
        if (toastContainer) {
            toastContainer.style.display = 'none';
        }
    } else {
        if (wrongAnswer) {
            wrongAnswer.style.display = 'none';
        }
        if (toastContainer) {
            toastContainer.style.display = 'flex';
        }
    }
}

function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add("hidden");
    }
}

function showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.remove("hidden");
    }
}

function findOnePrimeNumber() {
    const squares = document.querySelectorAll(".square");
    let foundPrimeNumber = false
    squares.forEach(square => {
        if (isPrime(parseInt(square.innerText)) && square.classList.contains("btn-outline-info") && !foundPrimeNumber) {
            square.classList.remove("btn-outline-info");
            square.classList.add("btn-success", "square-succes");
            square.style.pointerEvents = "none";
            amountOfPrimeNumbers--;
            foundPrimeNumber = true;
            primeNumbersLeft();
        }
    });
}

function toggleHardcoreCheckmark() {
    const hardcoreSwitch = document.querySelector("#HardcoreSwitch");
    hardcoreSwitch.checked = !hardcoreSwitch.checked;
}

function toggleSubway() {
    const subwaySwitch = document.querySelector("#subwaySwitch");
    subwaySwitch.checked = !subwaySwitch.checked;

    const subwaySurferDiv = document.querySelector("#subwaySurfer");
    const mainDiv = document.querySelector("#mainDiv");

    if (subwaySwitch.checked) {
        subwaySurferDiv.classList.remove("hidden");
        mainDiv.classList.add("col-lg-9");
    } else {
        subwaySurferDiv.classList.add("hidden");
        mainDiv.classList.remove("col-lg-9");
    }
}

function stop() {
    hideElement("#stopButton");
    findButton.classList.add("disabled");
    playAgain();
}

updateVisibility();
