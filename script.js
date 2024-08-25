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

//set appState for initial
const appState = {
  moneyTrans: undefined,
  dateMove: undefined,
  currentAccount: undefined,
  countDown: 100,
  summary: [0, 0, 0],
};

let date = new Date();
const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});
const formattedTime = formatter.format(date);

const accounts = [account1, account2, account3, account4];

//modify display number
const change = function (number) {
  let numberStr = String(number.toFixed(2));
  return numberStr.replace('.', ',').concat(' €');
};

//convert from seconds to minutes
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Định dạng số phút và giây để luôn có 2 chữ số
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

//set countdown time
function countDown(callback, seconds) {
  return callback(seconds);
}

//add new element DOM
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

//compute username from object's owner
const computingUsername = fullName => {
  return fullName
    .toLowerCase()
    .split(' ')
    .map(value => value[0])
    .join('');
};

const reset = function () {
  appState.moneyTrans = undefined;
  appState.dateMove = undefined;
  appState.summary = [0, 0, 0];
  appState.currentAccount = undefined;
  appState.countDown = 100;
  containerApp.style.opacity = 0;
  const allLabelSummary = document.querySelectorAll('.summary__value');

  containerMovements.innerHTML = ``;

  labelWelcome.textContent = `Log in to get started`; //Lời chào mừng
  for (const el of allLabelSummary) el.textContent = `0000 €`;
  loginForm.classList.toggle('hidden');
  labelBalance.textContent = `0000 €`;
};

//Load time and username
const init = function () {
  window.addEventListener('load', () => {
    const time = setInterval(() => {
      labelDate.textContent = `${new Date().toLocaleString(
        'en-GB',
        formattedTime
      )}`;
    }, 1000);
  });
  accounts.forEach(account => {
    account['username'] = computingUsername(account.owner);
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

const setupTrans = function (label1, value1) {
  const obj = {
    label1: label1,
    label2: labelBalance,
    container: containerMovements,
    value1: value1,
    value2: appState.summary[2],
    totalBalance: appState.moneyTrans.at(-1),
    dateTrans: appState.dateMove.at(-1),
    size: appState.moneyTrans.length - 1,
  };
  displayTransaction(obj);
};

const transaction = function (label1, summaryArr, pos, total) {
  setTimeout(() => {
    setupTrans(label1, summaryArr[pos]);
  }, 3000);
  appState.dateMove.push(
    `${new Date().toLocaleString('en-GB', formattedTime)}`
  );
  appState.moneyTrans.push(total);
  summaryArr[2] += total;
  summaryArr[pos] += total;
};

//Get value from 2 label
const getValueLabel = function (lbFirst, lbSecond) {
  return [lbFirst.value, Number(lbSecond.value)];
};

//Get value from label and delete data on label
const setupGetValue = function (lbFirst, lbSecond) {
  const [firstValue, secondValue] = getValueLabel(lbFirst, lbSecond);
  lbFirst.value = '';
  lbSecond.value = '';
  return [firstValue, secondValue];
};

//setup timeout session
const timeoutSession = function (interval) {
  labelTimer.textContent = countDown(formatTime, appState.countDown);
  if (appState.countDown > 0) {
    appState.countDown--;
  } else {
    clearInterval(interval);
    setTimeout(reset, 500);
    containerApp.style.opacity = 0;
  }
};
//find account
const getAccount = function (accounts, username) {
  return accounts.find(acc => acc.username === username);
};

//Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const [username, pin] = setupGetValue(inputLoginUsername, inputLoginPin);
  appState.currentAccount = getAccount(accounts, username);
  appState.moneyTrans = appState.currentAccount?.movements;
  appState.dateMove = appState.currentAccount?.movementsDate;
  const isCorrect = appState.currentAccount?.pin === Number(pin);

  if (isCorrect) {
    //set timeout session
    const timeout = setInterval(() => {
      timeoutSession(timeout);
    }, 1000);

    //async set display
    setTimeout(() => {
      labelSumIn.textContent = change(appState.summary[0]);
      labelSumOut.textContent = change(appState.summary[1]);
      labelBalance.textContent = change(appState.summary[2]); //Hiển thị tổng số tiền hiện tại
      labelWelcome.textContent = `Welcome, ${appState.currentAccount.owner}`; //Lời chào mừng
      loginForm.classList.toggle('hidden');
      //Hiển thị trang sau khi login
      containerApp.style.opacity = 1;
    }, 0);

    //Xóa element cũ
    containerMovements.innerHTML = ``;

    //calc balance, sum in, sum out
    appState.summary[2] = appState.moneyTrans.reduce((acc, curr, index) => {
      curr >= 0 ? (appState.summary[0] += curr) : (appState.summary[1] += curr);
      containerMovements.insertAdjacentHTML(
        'afterbegin',
        addElement(curr, appState.dateMove[index], index)
      );
      return acc + curr;
    }, 0);
  }
});

//Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const [transTo, transAmount] = setupGetValue(
    inputTransferTo,
    inputTransferAmount
  );
  if (appState.summary[2] >= transAmount) {
    const toPerson = getAccount(accounts, transTo);
    if (toPerson && toPerson !== appState.currentAccount) {
      transaction(labelSumOut, appState.summary, 1, -transAmount);
      toPerson.movementsDate.push(
        `${new Date().toLocaleString('en-GB', formattedTime)}`
      );
      toPerson.movements.push(transAmount);
    }
  }
});

//Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const depositAmount = Number(inputLoanAmount.value);
  if (depositAmount > 0) {
    transaction(labelSumIn, appState.summary, 0, depositAmount);
    inputLoanAmount.value = '';
  }
});

//Delete account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const [username, pin] = setupGetValue(inputCloseUsername, inputClosePin);
  const isCorrect =
    appState.currentAccount.username === username &&
    appState.currentAccount.pin === pin;

  if (isCorrect) {
    setTimeout(reset, 500);
    containerApp.style.opacity = 0;
    accounts.splice(accounts.indexOf(appState.currentAccount), 1); //remove this account from original data
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
  const copArr = appState.moneyTrans.slice().sort((a, b) => a - b);
  containerMovements.innerHTML = ``;
});

init();
