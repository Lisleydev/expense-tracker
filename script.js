const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addExpense = document.getElementById("addExpense");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const clearAll = document.getElementById("clearAll");
const emptyMessage = document.getElementById("emptyMessage");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    expenses.forEach(expense => {
        const li = document.createElement("li");

        li.className = "expense-item";

        li.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">
                    ${escapeHTML(expense.name)}
                </div>

                <div class="expense-category">
                    ${escapeHTML(expense.category)}
                </div>
            </div>

            <div class="expense-price">
                $${expense.amount.toFixed(2)}
            </div>

            <button class="delete-expense">
                🗑️
            </button>
        `;

        const deleteButton = li.querySelector(".delete-expense");

        deleteButton.addEventListener("click", () => {
            expenses = expenses.filter(item => item.id !== expense.id);

            saveExpenses();
            renderExpenses();
            updateTotal();
        });

        expenseList.appendChild(li);
    });

    updateTotal();
}

function addNewExpense() {
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (name === "") {
        alert("Please enter an expense name.");
        return;
    }

    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid amount.");
        return;
    }

    const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(newExpense);

    saveExpenses();

    expenseName.value = "";
    expenseAmount.value = "";

    renderExpenses();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

addExpense.addEventListener("click", addNewExpense);

expenseAmount.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addNewExpense();
    }
});

expenseName.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addNewExpense();
    }
});

clearAll.addEventListener("click", () => {
    if (expenses.length === 0) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete all expenses?"
    );

    if (confirmed) {
        expenses = [];

        saveExpenses();
        renderExpenses();
    }
});

renderExpenses();
