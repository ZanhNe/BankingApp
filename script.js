'use strict';

// BANKIST APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const loginForm = document.querySelector('.login');
const inputLoginAndPass = document.querySelector('login__input');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Data
const deposit = `deposit`;
const withdrawal = `withdrawal`;

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 234.9, 1300],
  movementsDate: [
    '28/01/2019',
    '01/04/2019',
    '28/05/2019',
    '12/07/2019',
    '19/11/2019',
    '23/12/2019',
    '08/03/2020',
    '12/03/2020',
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDate: [
    '01/02/2023',
    '06/02/2023',
    '28/02/2023',
    '01/03/2023',
    '10/03/2023',
    '24/03/2023',
    '30/03/2023',
    '02/04/2023',
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDate: [
    '15/10/2021',
    '31/10/2020',
    '28/11/2020',
    '01/12/2020',
    '19/02/2021',
    '15/12/2021',
    '21/03/2022',
    '10/04/2022',
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementsDate: [
    '01/01/2024',
    '26/03/2024',
    '28/03/2024',
    '21/04/2024',
    '19/06/2024',
  ],
  interestRate: 1,
  pin: 4444,
};

let moneyTrans;
let dateMove;
let currentAccount;
let countdown = 100;
let money = [0, 0, 0];
let date = new Date();
const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});
const formattedTime = formatter.format(date);

const accounts = [account1, account2, account3, account4];

//Add username to account object
for (const account of accounts) {
  let username = '';
  const arrName = account['owner'].split(' ');
  for (const name of arrName) {
    username += name.toLowerCase()[0];
  }
  account['username'] = username;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Định dạng số phút và giây để luôn có 2 chữ số
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

function countDown(callback, seconds) {
  return callback(seconds);
}

function reset() {
  money = [0, 0, 0];
  currentAccount = undefined;
  moneyTrans = undefined;
  dateMove = undefined;
  countdown = 100;
  containerApp.style.opacity = 0;
  const allLabelSummary = document.querySelectorAll('.summary__value');
  const allInput = document.querySelectorAll('.login__input');

  while (containerMovements.hasChildNodes())
    containerMovements.removeChild(containerMovements.firstElementChild);

  labelWelcome.textContent = `Log in to get started`; //Lời chào mừng
  for (const el of allLabelSummary) el.textContent = `0000 €`;
  for (const el of allInput) el.value = '';
  loginForm.classList.toggle('hidden');
  labelBalance.textContent = `0000 €`;
}

const change = function (number) {
  let numberStr = String(number.toFixed(2));
  return numberStr.replace('.', ',').concat(' €');
};

const addElement = function (value, date, order) {
  const type = (value < 0 && withdrawal) || deposit;
  return `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
    order + 1
  } ${type}</div>
          <div class="movements__date">${date}</div>
          <div class="movements__value">${change(value)}</div>
        </div>
  `;
};

const init = function () {
  window.addEventListener('load', () => {
    const time = setInterval(() => {
      labelDate.textContent = `${new Date().toLocaleString(
        'en-GB',
        formattedTime
      )}`;
    }, 1000);
  });
};
//display
const displayTransaction = function ({
  label1,
  label2,
  container,
  value1,
  value2,
  totalBalance,
  dateTrans,
  size,
}) {
  label1.textContent = change(value1);
  label2.textContent = change(value2);
  container.insertAdjacentHTML(
    'afterbegin',
    addElement(totalBalance, dateTrans, size)
  );
};

//Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  currentAccount = accounts.find(function (element) {
    return element.username === username;
  });
  const isCorrect = currentAccount?.pin === Number(pin);

  if (isCorrect) {
    setTimeout(() => {
      labelSumIn.textContent = change(money[0]);
      labelSumOut.textContent = change(money[1]);
      labelBalance.textContent = change(money[2]); //Hiển thị tổng số tiền hiện tại
      labelWelcome.textContent = `Welcome, ${currentAccount.owner}`; //Lời chào mừng
    }, 0);
    loginForm.classList.toggle('hidden');
    moneyTrans = currentAccount.movements;
    dateMove = currentAccount.movementsDate;

    //Hiển thị trang sau khi login
    containerApp.style.opacity = 1;

    for (let index = moneyTrans.length - 1; index >= 0; index--) {
      moneyTrans[index] >= 0
        ? (money[0] += moneyTrans[index])
        : (money[1] += moneyTrans[index]);
      money[2] = money[0] + money[1];
      containerMovements.insertAdjacentHTML(
        'beforeend',
        addElement(moneyTrans[index], dateMove[index], index)
      );
    }

    const timeout = setInterval(() => {
      labelTimer.textContent = countDown(formatTime, countdown);
      if (countdown > 0) {
        countdown--;
      } else {
        clearInterval(timeout);
        setTimeout(reset, 500);
        containerApp.style.opacity = 0;
      }
    }, 1000);
  }
});

//Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transTo = inputTransferTo.value;
  const transAmount = Number(inputTransferAmount.value);
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  if (money[2] >= transAmount) {
    const toPerson = accounts.find(element => {
      return element.username === transTo;
    });
    if (toPerson && toPerson !== currentAccount) {
      toPerson.movementsDate.push(
        `${new Date().toLocaleString('en-GB', formattedTime)}`
      );
      toPerson.movements.push(transAmount);
      dateMove.push(`${new Date().toLocaleString('en-GB', formattedTime)}`);
      moneyTrans.push(-transAmount);
      money[2] += -transAmount;
      money[1] += -transAmount;

      const obj = {
        label1: labelSumOut,
        label2: labelBalance,
        container: containerMovements,
        value1: money[1],
        value2: money[2],
        totalBalance: moneyTrans.at(-1),
        dateTrans: dateMove.at(-1),
        size: moneyTrans.length - 1,
      };
      displayTransaction(obj);
    }
  }
});

//Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const depositAmount = Number(inputLoanAmount.value);
  if (depositAmount > 0) {
    setTimeout(() => {
      const obj = {
        label1: labelSumIn,
        label2: labelBalance,
        container: containerMovements,
        value1: money[0],
        value2: money[2],
        totalBalance: moneyTrans.at(-1),
        dateTrans: dateMove.at(-1),
        size: moneyTrans.length - 1,
      };
      displayTransaction(obj);
    }, 3000);
    inputLoanAmount.value = '';
    moneyTrans.push(depositAmount);
    dateMove.push(`${new Date().toLocaleString('en-GB', formattedTime)}`);
    money[2] += depositAmount;
    money[0] += depositAmount;
  }
});

//Delete account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.username === username && currentAccount.pin === pin) {
    setTimeout(reset, 500);
    containerApp.style.opacity = 0;
    accounts.splice(accounts.indexOf(currentAccount), 1); //remove this account from original data
  }
});

//Sort
btnSort.addEventListener('click', e => {
  e.preventDefault();
  setTimeout(() => {
    for (let index = copArr.length - 1; index >= 0; index--) {
      containerMovements.insertAdjacentHTML(
        'beforeend',
        addElement(copArr[index], dateMove[index], index)
      );
    }
  }, 0);
  const copArr = currentAccount.movements.slice().sort((a, b) => a - b);
  while (containerMovements.hasChildNodes())
    containerMovements.removeChild(containerMovements.firstElementChild);
});

init();
