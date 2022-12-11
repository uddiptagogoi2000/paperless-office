console.log('hello')

// let date = new Date();
// let curDate = date.getDate();
// let curMonth = date.getMonth()+1;
// let curYear = date.getFullYear();
// if(curDate<10)
// {
//     curDate='0'+ curDate;
// }
// if(curMonth<10)
// {
//     curMonth='0'+curMonth;
// }
// let today=curYear+'-'+curMonth+'-'+curDate;
// let n= document.getElementById("fromDate");
// console.log(n.value);
// // document.getElementById("toDate").setAttribute('min',today);


const subject = document.querySelector('#subject');
const to = document.querySelector('#to');
const description = document.querySelector('#description');
const sendBtn = document.querySelector('#sendBtn');

const subjectDisplay = document.querySelector('#subjectDisplay');
const descriptionDisplay = document.querySelector('#descriptionDisplay');
const toDisplay = document.querySelector('#toDisplay');

sendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('clicked')
  subjectDisplay.innerText = subject.value;
  toDisplay.innerText = to.value;
  descriptionDisplay.innerText = description.value;
})