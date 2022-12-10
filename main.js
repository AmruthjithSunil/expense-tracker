let amount = document.getElementById('amount');
let description = document.getElementById('description');
let category = document.getElementById('category');
let form = document.getElementById('form');
let options = document.getElementsByClassName('option');
let expenseList = document.getElementById('expense-list');
form.addEventListener('submit', addExpense);
for(let i=0; i<options.length; i++){
    options[i].addEventListener('click', (e) => {
        category.textContent = options[i].textContent;
    })
}

for(let i=0; i<localStorage.length; i++){
    let li = document.createElement('li');
    let expense = JSON.parse(localStorage.getItem(localStorage.key(i)));
    li.appendChild(document.createTextNode(`${expense.amount}-${expense.category}-${expense.description}`));
    let delBtn = document.createElement('button');
    delBtn.textContent = 'Delete Expense';
    delBtn.classList.add('del');
    delBtn.classList.add('btn');
    delBtn.classList.add('btn-danger');
    li.appendChild(delBtn);
    delBtn.addEventListener('click', deleteLi);
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Expense';
    editBtn.classList.add('edit');
    editBtn.classList.add('btn');
    editBtn.classList.add('btn-warning');
    li.appendChild(editBtn);
    editBtn.addEventListener('click', editLi);
    expenseList.appendChild(li);
}

let delBtn = document.getElementsByClassName('del');
let editBtn = document.getElementsByClassName('edit');

for(let i=0; i<delBtn.length; i++){
    delBtn[i].addEventListener('click', deleteLi);
    editBtn[i].addEventListener('click', editLi);
}

function deleteLi(e) {
    let key = e.path[1].textContent.slice(0, -26).split("-")[2];
    localStorage.removeItem(key);
    e.path[1].remove();
}

function editLi(e) {
    let key = e.path[1].textContent.slice(0, -26).split("-")[2];
    localStorage.removeItem(key);
    amount.value = e.path[1].textContent.slice(0, -26).split("-")[0];
    description.value = e.path[1].textContent.slice(0, -26).split("-")[2];
    category.textContent = e.path[1].textContent.slice(0, -26).split("-")[1];
    e.path[1].remove();
}

function addExpense(e){
    e.preventDefault();
    let expense = {
        amount: amount.value,
        description: description.value,
        category: category.textContent
    }
    console.log(`${expense.amount}-${expense.category}-${expense.description}`);
    
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(`${expense.amount}-${expense.category}-${expense.description}`));
    let delBtn = document.createElement('button');
    delBtn.textContent = 'Delete Expense';
    delBtn.classList.add('del');
    delBtn.classList.add('btn');
    delBtn.classList.add('btn-danger');
    li.appendChild(delBtn);
    delBtn.addEventListener('click', deleteLi);
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Expense';
    editBtn.classList.add('edit');
    editBtn.classList.add('btn');
    editBtn.classList.add('btn-warning');
    li.appendChild(editBtn);
    editBtn.addEventListener('click', editLi);
    expenseList.appendChild(li);

    let expenseString = JSON.stringify(expense);
    let key = `${expense.description}`;
    localStorage.setItem(key, expenseString);

    amount.value = '';
    description.value = '';
    category.textContent = 'Categories';
}