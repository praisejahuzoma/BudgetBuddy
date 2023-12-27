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
    "https://budgetbuddy-c8acf-default-rtdb.europe-west1.firebasedatabase.app/",
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
// ... [Previous code remains unchanged]

// Function to delete an item from the market list
const deleteItem = (id) => {
  const itemRef = ref(database, `marketList/${id}`); // Reference the specific item in the database

  remove(itemRef)
    .then(() => {
      console.log(`Item with ID ${id} removed from Firebase`);
      // After successful deletion, remove the item from the local array
      const itemIndex = marketList.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        marketList.splice(itemIndex, 1);
        renderItems(marketList); // Update the UI after deletion
      }
    })
    .catch((error) => {
      console.error("Error removing item from Firebase:", error);
    });
};


const currencySelector = document.getElementById("currency-selector");
const totalMoney = document.querySelector(".total-money");

// Function to convert amount based on selected currency
const convertCurrency = (amount, selectedCurrency) => {
  const ngnToUSD = 0.0025; // Replace with actual conversion rate
  const ngnToEUR = 0.0021; // Replace with actual conversion rate

  switch (selectedCurrency) {
    case "USD":
      return amount * ngnToUSD;
    case "EUR":
      return amount * ngnToEUR;
    default:
      return amount; // If currency is NGN (Naira), return the original amount
  }
};

// Helper function to format currency based on the selected currency
const formatCurrency = (amount, currency) => {
  switch (currency) {
    case "USD":
      return `&#36; ${amount.toFixed(2)}`; // Format Dollar with two decimal places
    case "EUR":
      return `&#8364; ${amount.toFixed(2)}`; // Format Euro with two decimal places
    default:
      return `&#8358; ${amount.toFixed(2)}`; // Format Naira with two decimal places
  }
};

// Function to set the selected currency and update the UI
const setCurrency = (selectedCurrency) => {
  localStorage.setItem("selectedCurrency", selectedCurrency); // Store selected currency in localStorage
  renderItems(marketList);
};

// Event listener for currency selection change
currencySelector.addEventListener("change", () => {
  setCurrency(currencySelector.value);
});

// Function to get the selected currency from localStorage or default to NGN (Naira)
const getSelectedCurrency = () => {
  return localStorage.getItem("selectedCurrency") || "NGN";
};

// Function to initialize the selected currency and render items
const initializeCurrency = () => {
  const selectedCurrency = getSelectedCurrency();
  currencySelector.value = selectedCurrency;
  renderItems(marketList);
};

// Modify the renderItems function to apply currency conversion
const renderItems = (marketList) => {
  const ul = document.querySelector(".list-items");
  ul.innerHTML = "";

  const selectedCurrency = getSelectedCurrency();
   const currencySymbol = getCurrencySymbol(selectedCurrency);

  marketList.forEach((listItem) => {
    const li = document.createElement("li");
     li.setAttribute("class", "list-item");
     li.setAttribute("data-key", listItem.id);

    const convertedAmount = convertCurrency(listItem.amount, selectedCurrency);


    li.innerHTML = `  
      <box-icon name='message-square-x' color='#73b6c8' class="checkbox"></box-icon>
      <p class="item">${listItem.item}</p>
      <p class="desc">${listItem.description}</p>
      <p class="qty">${listItem.quantity}</p>
      <p class="price">${formatCurrency(convertedAmount, selectedCurrency)}</p>
   <p class="amount">${currencySymbol} ${listItem.amount} </p>`;

    ul.appendChild(li);
    // Attach the deleteItem function to each delete icon
    li.querySelector(".checkbox").addEventListener("click", () => {
      deleteItem(listItem.id);
    });
  });

  totalMoney.innerHTML = `${formatCurrency(getTotal(marketList), selectedCurrency)}`;
  resetInputFields();
};
const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode) {
    case "USD":
      return "&#36;"; // Dollar symbol
    case "EUR":
      return "&#8364;"; // Euro symbol
    default:
      return "&#8358;"; // Default to Naira symbol
  }
};
// On page load, initialize the selected currency
window.addEventListener("load", () => {
  initializeCurrency();
});

// Listen for changes in the Firebase database
onValue(marketListInDB, (snapshot) => {
  marketList = [];
  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    marketList.push(item);
  });

  renderItems(marketList);
});

// ... [Rest of your code remains unchanged]

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







