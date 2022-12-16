const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const expenseList = document.getElementById('expense-list');
const endpointId = '7acda206c4fb4492947eb719e3662858';
const serverLink = `https://crudcrud.com/api/${endpointId}/expense`;

addEventListener('DOMContentLoaded', () => {
    [...document.getElementsByClassName('option')].forEach(option => {
        option.addEventListener('click', (e) => {
            category.textContent = option.textContent;
        })
    });
    axios(serverLink)
    .then(res => {
        const expenseJSON = res.data;
        for(let i=0; i<expenseJSON.length; i++){
            expenseList.appendChild(createLi(expenseJSON[i]));
        }
    })
});

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();
    const expense = {
        amount: amount.value,
        description: description.value,
        category: category.textContent
    }
    if(isInputsMissing(expense)){
        return;
    }    
    expenseList.appendChild(createLi(expense));
    axios.post(serverLink, expense)
    .then(res => console.log(res))
    .catch(err => console.log(err));    
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    category.textContent = 'Categories';
}

function createLi(expense) {
    const textContent = `${expense.amount}-${expense.category}-${expense.description}`;    
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(textContent));
    li.setAttribute('id', expense._id);
    li.appendChild(createDeleteButton());
    li.appendChild(createEditButton());
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
    axios.delete(`${serverLink}/${e.path[1].id}`)
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
    if(expense.amount === ''){
        missingInputs.textContent += 'Amount is missing.';
    }
    if(expense.description === ''){
        missingInputs.textContent += ' Description is missing.';
    }
    if(expense.category === 'Categories'){
        missingInputs.textContent += ' Choose a category.';
    }
    if(missingInputs.textContent == ''){
        return false;
    }
    return true;
}