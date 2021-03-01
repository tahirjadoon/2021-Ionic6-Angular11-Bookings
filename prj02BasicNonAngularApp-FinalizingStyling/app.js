const txtReason = document.querySelector('#txtReason');
const txtAmount = document.querySelector('#txtAmount');
const btnClear = document.querySelector('#btnClear');
const btnAdd = document.querySelector('#btnAdd');
const expenseList = document.querySelector('#expenses-list');
const totalExpensesOutput = document.querySelector('#totalExpenses');
const alertCtrl = document.querySelector('ion-alert-controller');

let totalExpenses = 0;

const clear = () => {
   txtReason.value = "";
   txtAmount.value = "";
};

btnAdd.addEventListener('click', () => {
   const reason = txtReason.value.trim();
   const amount = txtAmount.value.trim();

   if(reason.length <= 0 || amount.length <= 0 || amount <= 0){
      presentAlert();
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

const presentAlert = () => {
   const alert = document.createElement('ion-alert');
   //alert.cssClass = 'my-custom-class';
   alert.header = 'Invalid Input';
   alert.subHeader = 'Why Invalid?';
   alert.message = 'Please enter valid reason and amoount!';
   alert.buttons = ['OK'];
 
   document.body.appendChild(alert);
   return alert.present();
 };