const amount = document.getElementById("amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const serverLink = `http://localhost:4000`;

addEventListener("DOMContentLoaded", () => {
  const addingEventListernerToOptionsDropdown = () => {
    const options = document.querySelectorAll(".option");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener("click", (e) => {
        category.textContent = options[i].textContent;
      });
    }
  };

  const getExpenseList = async () => {
    try {
      const res = await axios.get(serverLink);
      const expenses = res.data;
      for (let i = 0; i < expenses.length; i++) {
        expenseList.appendChild(createLi(expenses[i]));
      }
      console.log("Received Expenses from db");
    } catch (err) {
      console.log(err);
    }
  };

  addingEventListernerToOptionsDropdown();
  getExpenseList();
});

document.getElementById("form").addEventListener("submit", addExpense);

function addExpense(e) {
  e.preventDefault();

  let expense = {
    amount: amount.value,
    description: description.value,
    category: category.textContent,
  };

  if (isInputsMissing(expense)) {
    return;
  }

  const postNewExpense = async () => {
    try {
      const res = await axios.post(serverLink, expense);
      expense = res.data;
      expenseList.appendChild(createLi(expense));
      console.log("New Expense Added");
      console.log(expense);
    } catch (err) {
      console.log(err);
    }
  };

  const settingInputValuesToDefault = () => {
    amount.value = "";
    description.value = "";
    category.textContent = "Categories";
  };

  postNewExpense();
  settingInputValuesToDefault();
}

function createLi(expense) {
  const li = document.createElement("li");
  li.textContent = `${expense.amount}-${expense.category}-${expense.description}`;
  li.id = expense.id;
  li.className = "mt-3";
  li.style.width = "500px";
  li.appendChild(createDeleteButton());
  return li;
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "del btn btn-danger float-end";
  deleteButton.addEventListener("click", deleteLi);
  return deleteButton;
}

function deleteLi(e) {
  const deleteData = async () => {
    try {
      const res = await axios.delete(
        `${serverLink}/${e.target.parentElement.id}`
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  deleteData();
  e.target.parentElement.remove();
}

function isInputsMissing(expense) {
  let missingInputs = document.getElementById("missing-inputs");

  missingInputs.textContent = "";

  if (expense.amount === "") {
    missingInputs.textContent += "Amount is missing.";
  }
  if (expense.description === "") {
    missingInputs.textContent += " Description is missing.";
  }
  if (expense.category === "Categories") {
    missingInputs.textContent += " Choose a category.";
  }

  if (missingInputs.textContent == "") {
    return false;
  }
  return true;
}
