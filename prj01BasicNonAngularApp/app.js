const txtReason = document.querySelector('#txtReason');
const txtAmount = document.querySelector('#txtAmount');
const btnClear = document.querySelector('#btnClear');
const btnAdd = document.querySelector('#btnAdd');
const expenseList = document.querySelector('#expenses-list');
const totalExpensesOutput = document.querySelector('#totalExpenses');

let totalExpenses = 0;

const clear = () => {
   txtReason.value = "";
   txtAmount.value = "";
};

btnAdd.addEventListener('click', () => {
   const reason = txtReason.value.trim();
   const amount = txtAmount.value.trim();

   if(reason.length <= 0 || amount.length <= 0 || amount <= 0){
      alert("Invalid values!");
      return;
   }

   const newItem = document.createElement('ion-item');
   newItem.textContent = `${reason}: $${amount}`;
   expenseList.appendChild(newItem);

   totalExpenses += +amount;

   totalExpensesOutput.textContent = `$${totalExpenses}`;

   clear();
});

btnClear.addEventListener('click', clear);