'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const displayMovements=function(movements,sort=false){
  

  const movs=sort?movements.slice().sort((a,b)=>a-b):movements;
  console.log(sort);
  containerMovements.innerHTML='';
  movs.forEach(function(mov,i){
    const type=mov>0?'deposit':'withdrawal';

    const html=`
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type} deposit</div>
          <div class="movements__value">${mov}</div>
       </div>`;

       containerMovements.insertAdjacentHTML("afterbegin",html);
  })
    
  };
//displayMovements(account1.movements);

function createUsernames(accs){
  accs.forEach(function(acc){
    acc.username =acc.owner.toLowerCase().split(' ').map(word=>word[0]).join('');
  });
}
createUsernames(accounts);
console.log(accounts);

const calcDisplayBalance= function(account){
  const balance= account.movements.reduce((acc,mov)=> acc + mov,0);
  labelBalance.textContent=`${balance} EUR`;
  account.balance=balance;
}
//calcDisplayBalance(movements);
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};








const eurToUsd=1.1;
const movementUsd= movements.map(mov=>mov*eurToUsd)
console.log(movements);
console.log(movementUsd);

const withdrawls= movements.filter(function(amount){
  return amount<0;
})
console.log(withdrawls);

const balance= movements.reduce((acc,mov)=>acc +mov,
0);
console.log(balance);




//Summary
const calcDisplaySummary= function(account){  
  const incomes=account.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
  //console.log(incomes);
 labelSumIn.textContent=`${incomes}$`;
 const outcomes= Math.abs(account.movements.filter((mov)=>mov<0).reduce((acc,mov)=>acc+mov,0));
 labelSumOut.textContent=`${outcomes}$`;
 const interests=account.movements.filter(mov=>mov>0).map(deposit=>deposit*account.interestRate/100).filter(deposit=>deposit>=1).reduce((acc,int)=>acc+int,0);
 labelSumInterest.textContent=`${interests}$`;
}
calcDisplaySummary(account1);


//LOGIN EVENT HANDLERS

let currentAccount;
let currentPin;
let currentUser;

btnLogin.addEventListener('click',function(e){
  //Preventing default rload from happening
  e.preventDefault();
  currentAccount= accounts.find(acc=>acc.username===inputLoginUsername.value);
  if(currentAccount?.pin===Number(inputLoginPin.value)){
    console.log(currentAccount);
    //Display UI and Welcome message
    labelWelcome.textContent=`Welcome, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity=100;

    //Display Summary
    calcDisplaySummary(currentAccount);
    
    //Display Movements
      displayMovements(currentAccount.movements);

    //Display Balance
    calcDisplayBalance(currentAccount); 
  }
})

function transferMoney(account,amount){
    account.balance+=amount;
    account.movements.push(amount);
    currentAccount.balance-=amount;
    currentAccount.movements.push(amount*(-1));
    } 





//Transfer Button
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
 
  const transferAccount= accounts.find(acc=>acc.username===inputTransferTo.value);
  //console.log(transferAccount);
  const transferAmount= Number(inputTransferAmount.value);
   if(transferAmount>0 &&transferAccount?.username!==currentAccount.username && currentAccount.balance>=transferAmount){
   transferMoney(transferAccount,transferAmount);
   displayMovements(currentAccount.movements);
   calcDisplayBalance(currentAccount);
} else {
  console.log('Invalid Transaction');
}
inputTransferAmount.value=inputTransferTo.value=''
});

//SOME AND EACH METHOD 
//LOAN BUTTON

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(loan=>loan>=amount*0.1)){
   currentAccount.movements.push(amount);
   updateUI(currentAccount);
  }
})



const arr=[[1,2,3],4,5,[6,7]];
console.log(arr.flat());
const arrDeep=[[1,2,[3,4]],5,6,[7,[8]]];
console.log(arrDeep.flat(3))






//FIND INDEX METHOD
//CLOSING AN ACCOUNT

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
     console.log('correct');
    const index=accounts.findIndex(acc=>acc.username===currentAccount.username)
    console.log(index);
    accounts.splice(index,1);
    containerApp.style.opacity=0;
  }else{
    console.log("INVALID LOGIN OR PIN");
    console.log(inputCloseUsername.value, inputClosePin.value);

  }
inputClosePin.value=inputCloseUsername.value=''
});


let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted= !sorted;
})



const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];


//1
dogs.forEach(function(doggo){
  doggo.recommendedFood=(doggo.weight**0.75*28)/1000;
});

//2
const sarahDog=dogs.filter(doggo=>doggo.owners.includes('Sarah'));
console.log(sarahDog.recommendedFood*1000>sarahDog.curFood? 'Eating Less':'Eating More');
function foodCalculator(ownerDog){
if(ownerDog.recommendedFood*1000>ownerDog.currFood){
console.log('Eating Less');
}else{
  console.log('Eating more');
}}
//foodCalculator(sarahDog);


//3

const ownersEatTooMuch=dogs.filter(doggo=>doggo.curFood>doggo.recommendedFood*1000).map(doggo=>doggo.owners).flat();
const ownersEatTooLittle=dogs.filter(doggo=>doggo.curFood<doggo.recommendedFood*1000).map(doggo=>doggo.owners).flat();;
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

//4
console.log(`${[...ownersEatTooMuch]}`.replaceAll(',' ,' and ')+"'s dogs eat too much");
 console.log(`${[...ownersEatTooLittle]}`.replaceAll(',' ,' and ')+"'s dogs eat too much");
//5

console.log(dogs.some(doggo=>doggo.curFood===doggo.recommendedFood));

//6
console.log(dogs.some(doggo=> doggo.recommendedFood*1000*0.9<doggo.curFood && doggo.curFood<doggo.recommendedFood*1000*1.1));

//7

const okayDogs= dogs.filter(doggo=> doggo.recommendedFood*1000*0.9<doggo.curFood && doggo.curFood<doggo.recommendedFood*1000*1.1);
console.log(okayDogs);

//8

console.log(dogs.splice(0).map(doggo=>doggo.recommendedFood).sort((a,b)=>a-b));



