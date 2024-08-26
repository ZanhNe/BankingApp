'use strict';

// BANKIST APP

// Elements
const body = document.querySelector('body');
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

//accounts list

//set appState for initial
const appState = {
  accounts: [account1, account2, account3, account4],
  deposit: `deposit`,
  withdrawal: `withdrawal`,
  moneyTrans: undefined,
  dateMove: undefined,
  currentAccount: undefined,
  countDown: 100,
  summary: [0, 0, 0],
  isSort: false,
  dateCreate: function () {
    if (!this.date) this.date = new Date();
    return this.date;
  },
  formatterCreate: function () {
    if (!this.formatter)
      this.formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
    return this.formatter;
  },

  resetState: function () {
    this.moneyTrans = undefined;
    this.dateMove = undefined;
    this.currentAccount = undefined;
    this.countDown = 100;
    this.summary = [0, 0, 0];
    this.isSort = false;
  },
  formattedTime: function () {
    return this.formatterCreate().format(this.dateCreate());
  },
  formatTime: function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Định dạng số phút và giây để luôn có 2 chữ số
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  },
  modify: function (number) {
    let numberStr = String(number.toFixed(2));
    return numberStr.replace('.', ',').concat(' €');
  },
  countdown: function (callback, seconds) {
    return callback(seconds);
  },
  addElement: function (value, date, order) {
    const type = (value < 0 && this.withdrawal) || this.deposit;
    return `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      order + 1
    } ${type}</div>
            <div class="movements__date">${date}</div>
            <div class="movements__value">${this.modify(value)}</div>
          </div>
    `;
  },
  computingUsername: function (fullName) {
    return fullName
      .toLowerCase()
      .split(' ')
      .map(singleName => singleName[0])
      .join('');
  },
  createUsernames: function () {
    this.accounts.forEach(acc => {
      acc['username'] = this.computingUsername(acc.owner);
    });
  },
  reset: function () {
    this.resetState();
    containerApp.style.opacity = 0;
    const allLabelSummary = document.querySelectorAll('.summary__value');

    containerMovements.innerHTML = ``;

    labelWelcome.textContent = `Log in to get started`; //Lời chào mừng
    for (const el of allLabelSummary) el.textContent = `0000 €`;
    loginForm.classList.toggle('hidden');
    labelBalance.textContent = `0000 €`;
  },
  setTime: function () {
    window.addEventListener('load', () => {
      setInterval(() => {
        labelDate.textContent = `${new Date().toLocaleString(
          'en-GB',
          this.formattedTime()
        )}`;
      }, 1000);
    });
  },
  insert: function (mov, index) {
    console.log(mov, index, this);
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      this.addElement(mov, this.dateMove[index], index)
    );
  },
  displayTransaction: function ({ label1, value1, totalBalance, size }) {
    label1.textContent = this.modify(value1);
    labelBalance.textContent = this.modify(this.summary[2]);
    this.insert(totalBalance, size);
  },
  setupTrans: function (label1, value1) {
    const obj = {
      label1: label1,
      value1: value1,
      totalBalance: this.moneyTrans.at(-1),
      size: this.moneyTrans.length - 1,
    };
    this.displayTransaction(obj);
  },
  transaction: function (label1, summaryArr, pos, total) {
    setTimeout(() => {
      this.setupTrans(label1, summaryArr[pos]);
    }, 3000);
    this.dateMove.push(
      `${new Date().toLocaleString('en-GB', this.formattedTime())}`
    );
    this.moneyTrans.push(total);
    summaryArr[2] += total;
    summaryArr[pos] += total;
  },
  getValueLabel: function (lbFirst, lbSecond) {
    return [lbFirst.value, Number(lbSecond.value)];
  },
  setupGetValue: function (lbFirst, lbSecond) {
    const [firstValue, secondValue] = this.getValueLabel(lbFirst, lbSecond);
    lbFirst.value = lbSecond = ``;
    return [firstValue, secondValue];
  },
  timeoutSession: function (interval) {
    labelTimer.textContent = this.countdown(this.formatTime, this.countDown);
    if (appState.countDown > 0) {
      this.countDown--;
    } else {
      clearInterval(interval);
      setTimeout(this.reset.bind(this), 500);
      containerApp.style.opacity = 0;
    }
  },
  getAccount: function (accounts, username) {
    return accounts.find(acc => acc.username === username);
  },
  login: function () {
    btnLogin.addEventListener('click', e => {
      e.preventDefault();
      const [username, pin] = this.setupGetValue(
        inputLoginUsername,
        inputLoginPin
      );
      this.currentAccount = this.getAccount(this.accounts, username);
      this.moneyTrans = this.currentAccount?.movements;
      this.dateMove = this.currentAccount?.movementsDate;
      const isCorrect = this.currentAccount?.pin === Number(pin);

      if (isCorrect) {
        //set timeout session
        const timeout = setInterval(() => {
          this.timeoutSession(timeout);
        }, 1000);

        //async set display
        setTimeout(() => {
          labelSumIn.textContent = this.modify(this.summary[0]);
          labelSumOut.textContent = this.modify(this.summary[1]);
          labelBalance.textContent = this.modify(this.summary[2]); //Hiển thị tổng số tiền hiện tại
          labelWelcome.textContent = `Welcome, ${this.currentAccount.owner}`; //Lời chào mừng
          loginForm.classList.toggle('hidden');
          //Hiển thị trang sau khi login
          containerApp.style.opacity = 1;
        }, 0);

        //Xóa element cũ
        containerMovements.innerHTML = ``;

        //calc balance, sum in, sum out
        this.summary[2] = this.moneyTrans.reduce((acc, curr, index) => {
          curr >= 0 ? (this.summary[0] += curr) : (this.summary[1] += curr);
          containerMovements.insertAdjacentHTML(
            'afterbegin',
            this.addElement(curr, this.dateMove[index], index)
          );
          return acc + curr;
        }, 0);
      }
    });
  },
  transfer: function () {
    btnTransfer.addEventListener('click', e => {
      e.preventDefault();
      const [transTo, transAmount] = this.setupGetValue(
        inputTransferTo,
        inputTransferAmount
      );
      if (transAmount > 0 && this.summary[2] >= transAmount) {
        const toPerson = this.getAccount(this.accounts, transTo);
        if (toPerson && toPerson !== this.currentAccount) {
          this.transaction(labelSumOut, this.summary, 1, -transAmount);
          toPerson.movementsDate.push(
            `${new Date().toLocaleString('en-GB', this.formattedTime())}`
          );
          toPerson.movements.push(transAmount);
        }
      }
    });
  },
  loan: function () {
    btnLoan.addEventListener('click', e => {
      e.preventDefault();
      const depositAmount = Number(inputLoanAmount.value);
      if (
        this.currentAccount.movements.some(
          mov => mov >= 0.1 * depositAmount && depositAmount > 0
        )
      ) {
        this.transaction(labelSumIn, this.summary, 0, depositAmount);
        inputLoanAmount.value = '';
      }
    });
  },
  close: function () {
    btnClose.addEventListener('click', e => {
      e.preventDefault();
      const [username, pin] = this.setupGetValue(
        inputCloseUsername,
        inputClosePin
      );
      const isCorrect =
        this.currentAccount.username === username &&
        this.currentAccount.pin === pin;

      if (isCorrect) {
        setTimeout(this.reset.bind(this), 500);
        containerApp.style.opacity = 0;
        this.accounts.splice(
          this.accounts.findIndex(account => account === this.currentAccount),
          1
        ); //remove this account from original data
      }
    });
  },
  sortMovements: function () {
    btnSort.addEventListener('click', e => {
      e.preventDefault();
      containerMovements.innerHTML = ``;
      if (!this.isSort) {
        const copArr = this.moneyTrans.slice().sort((a, b) => a - b);
        copArr.forEach(this.insert, this);
      } else {
        this.moneyTrans.forEach(this.insert, this);
      }
      this.isSort = !this.isSort;
    });
  },
  init: function () {
    this.setTime();
    this.createUsernames();
  },
  start: function () {
    this.init();
    this.login();
    this.transfer();
    this.loan();
    this.close();
    this.sortMovements();
  },
};

appState.start();
