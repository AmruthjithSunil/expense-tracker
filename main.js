const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const expenseList = document.getElementById('expense-list');
const endpointId = 'e1ff4cd9712d4c6990512de274016515';
const serverLink = `https://crudcrud.com/api/${endpointId}/expense`;
let id = null;

addEventListener('DOMContentLoaded', () => {
    [...document.getElementsByClassName('option')].forEach(option => {
        option.addEventListener('click', (e) => {
            category.textContent = option.textContent;
        })
    });

    const getData = async () => {
        try{
            const res = await axios.get(serverLink);
            const expenses = res.data;
            for(let i=0; i<expenses.length; i++){
                expenseList.appendChild(createLi(expenses[i]));
            }
        }catch(err){
            console.log(err);
        }
    };
    getData();
});

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();
    let expense = {
        amount: amount.value,
        description: description.value,
        category: category.textContent
    }
    if(isInputsMissing(expense)){
        return;
    }    
    
    const postData = async () => {
        try{
            let res;
            if(id == null){
                res = await axios.post(serverLink, expense);
                expense = res.data;
            }else{
                res = await axios.put(`${serverLink}/${id}`, expense);
                expense._id = id;
                id = null;
            }
            console.log(res);
            expenseList.appendChild(createLi(expense));
        }catch(err){
            console.log(err);
        }
    }
    postData();

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    category.textContent = 'Categories';
}

function createLi(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.amount}-${expense.category}-${expense.description}`;  
    li.id = expense._id;
    li.appendChild(createDeleteButton());
    li.appendChild(createEditButton());
    return li;
}

function createDeleteButton(){
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.className = 'del btn btn-danger';
    deleteButton.addEventListener('click', deleteLi);
    return deleteButton;
}

function createEditButton(){
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Expense';
    editButton.className = 'edit btn btn-warning';
    editButton.addEventListener('click', editLi);
    return editButton;
}

function deleteLi(e) {
    const deleteData = async () => {
        try{
            const res = await axios.delete(`${serverLink}/${e.path[1].id}`);
            console.log(res);
        }catch(err){
            console.log(err);
        }
    };
    deleteData();
    e.path[1].remove();
}

function editLi(e) {
    const contents = e.path[1].textContent.slice(0, -26).split('-');
    amount.value = contents[0];
    description.value = contents[2];
    category.textContent = contents[1];
    id = e.path[1].id;
    e.path[1].remove();
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