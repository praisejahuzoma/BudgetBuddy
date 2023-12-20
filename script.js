// Import Firebase SDK modules for initialization and database operations
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration settings for your app
const appSettings = {
  databaseURL:
    "https://budgetbuddy-3aa91-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize the Firebase app with the provided settings
const app = initializeApp(appSettings);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Define a reference to the "marketList" location in the database
const marketListInDB = ref(database, "marketList");

let marketList = [];

const amount = document.querySelector(".amount-input");
const description = document.querySelector(".description-input");
const item = document.querySelector(".item-input");
const button = document.querySelector("button");
const qty = document.querySelector(".qty-input");
const price = document.querySelector(".price-input");
const total = document.querySelector("#total");

button.addEventListener("click", () => {
  const itemValue = item.value;
  const descriptionValue = description.value;
  const quantity = parseFloat(qty.value);
  const priceValue = parseFloat(price.value);
  const id = Math.floor(Math.random() * 1000 + 1);

  const listItem = {
    id: id,
    item: itemValue,
    description: descriptionValue,
    quantity: quantity,
    price: priceValue,
    amount: quantity * priceValue,
  };

  if (itemValue === "" || quantity === "" || priceValue === "") {
    return;
  }
  marketList.push(listItem);

  renderItems(marketList);

  push(marketListInDB, listItem);
});

const renderItems = (marketList) => {
  let ul = document.querySelector(".list-items");
  ul.innerHTML = "";
  marketList.forEach((listItem) => {
    const li = document.createElement("li");
    li.setAttribute("class", "list-item");
    li.setAttribute("data-key", listItem.id);
    li.innerHTML = `  
        <input type="checkbox" name="selectAll" id="selectAll" class="checkbox">
        <p class="item">${listItem.item}</p>
        <p class="desc">${listItem.description}</p>
        <p class="qty">${listItem.quantity}</p>
        <p class="price">&#8358 ${listItem.price}</p>
        <p class="amount">&#8358 ${listItem.amount}</p>`;
    ul.appendChild(li);
  });
  total.innerHTML = `&#8358 ${getTotal(marketList)}`;
  resetInputFields();
};

const qtyEvents = ["change", "keyup"];

qtyEvents.forEach((event) => {
  qty.addEventListener(event, () => {
    amount.value = qty.value * price.value;
  });
});

qtyEvents.forEach((event) => {
  price.addEventListener(event, () => {
    amount.value = qty.value * price.value;
  });
});

const getTotal = (marketList) => {
  return marketList.reduce((total, item) => {
    return total + item.amount;
  }, 0);
};

const resetInputFields = () => {
  item.value = "";
  description.value = "";
  price.value = "";
  qty.value = 1;
};

// Listen for changes in the Firebase database
onValue(marketListInDB, (snapshot) => {
  marketList = [];
  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    marketList.push(item);
  });

  renderItems(marketList);
});
