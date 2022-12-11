let category = document.getElementById('category');
let expenseList = document.getElementById('expense-list');

[...document.getElementsByClassName('option')].forEach(option => {
    option.addEventListener('click', (e) => {
        category.textContent = option.textContent;
    })
});

for(let i=0; i<localStorage.length; i++){
    const expense = JSON.parse(localStorage.getItem(localStorage.key(i)));
    expenseList.appendChild(createLi(expense));
}

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();

    const expense = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: category.textContent
    }

    if(isInputsMissing(expense))
        return;

    expenseList.appendChild(createLi(expense));
    localStorage.setItem(JSON.stringify(expense), JSON.stringify(expense));
    
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    category.textContent = 'Categories';
}

function createLi(expense) {
    const textContent = `${expense.amount}-${expense.category}-${expense.description}`;
    
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(textContent));

    const deleteButton = createDeleteButton();
    li.appendChild(deleteButton);

    const editButton = createEditButton();
    li.appendChild(editButton);

    return li;
}

function createDeleteButton(){
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.classList.add('del');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.addEventListener('click', deleteLi);
    return deleteButton;
}

function createEditButton(){
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Expense';
    editButton.classList.add('edit');
    editButton.classList.add('btn');
    editButton.classList.add('btn-warning');
    editButton.addEventListener('click', editLi);
    return editButton;
}

function deleteLi(e) {
    const textContent = e.path[1].textContent.slice(0, -26).split("-");
    const expense = {
        amount: textContent[0],
        description: textContent[2],
        category: textContent[1]
    }
    localStorage.removeItem(JSON.stringify(expense));
    e.path[1].remove();
    return expense;
}

function editLi(e) {
    const expense = deleteLi(e);
    amount.value = expense.amount;
    description.value = expense.description;
    category.textContent = expense.category;
}

function isInputsMissing(expense){
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