import { backend } from 'declarations/backend';

let currentInput = '';
let currentOperator = '';
let previousInput = '';
const display = document.getElementById('display');
const loading = document.getElementById('loading');

document.querySelectorAll('.number, .decimal').forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent === '.' && currentInput.includes('.')) return;
        currentInput += button.textContent;
        updateDisplay();
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        if (currentInput !== '') {
            if (previousInput !== '') {
                calculate();
            } else {
                previousInput = currentInput;
                currentInput = '';
            }
            currentOperator = button.dataset.action;
        }
    });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', calculate);

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    currentInput = '';
    currentOperator = '';
    previousInput = '';
    updateDisplay();
});

async function calculate() {
    if (previousInput !== '' && currentInput !== '' && currentOperator !== '') {
        loading.style.display = 'block';
        try {
            const result = await backend.calculate(parseFloat(previousInput), parseFloat(currentInput), currentOperator);
            currentInput = result.toString();
            previousInput = '';
            currentOperator = '';
            updateDisplay();
        } catch (error) {
            display.textContent = 'Error';
        } finally {
            loading.style.display = 'none';
        }
    }
}

function updateDisplay() {
    display.textContent = currentInput || '0';
}
