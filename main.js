let category = document.getElementById('category');
let expenseList = document.getElementById('expense-list');

[...document.getElementsByClassName('option')].forEach(option => {
    option.addEventListener('click', (e) => {
        category.textContent = option.textContent;
    })
});

for(let i=0; i<localStorage.length; i++){
    let expense = JSON.parse(localStorage.getItem(localStorage.key(i)));
    expenseList.appendChild(createLi(expense));
}

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();

    let expense = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: category.textContent
    }

    if(missingInputs(expense))
        return;

    expenseList.appendChild(createLi(expense));
    
    let expenseString = JSON.stringify(expense);
    let key = `${expense.description}`;
    localStorage.setItem(key, expenseString);
    
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    category.textContent = 'Categories';
}

function createLi(expense) {
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
    return li;
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

function missingInputs(expense){
    let missingInputs = document.getElementById('missing-inputs');
    missingInputs.textContent = '';

    if(expense.amount === '')
        missingInputs.textContent += 'Amount is missing.';

    if(expense.description === '')
        missingInputs.textContent += ' Description is missing.';

    if(expense.category === 'Categories')
        missingInputs.textContent += ' Choose a category.';
    
    if(missingInputs.textContent == '')
        return false;
    else
        return true;
}