// copy right

const year = new Date().getFullYear();
const yearText = document.querySelector('.year');
yearText.innerHTML = year;

// end of copy right

let marketList = [
   
];

const amount = document.querySelector(".amount-input");
const button = document.querySelector("button");
const qty = document.querySelector(".qty-input");
const price = document.querySelector(".price-input");


button.addEventListener("click",() => {
    const item = document.querySelector(".item-input").value;
    const description = document.querySelector(".description-input").value;
    const quantity = document.querySelector(".qty-input").value;
    const price = document.querySelector(".price-input").value;
    const id = Math.floor((Math.random() * 1000) + 1);

    let listItem = {id:id,item:item,description:description,quantity:quantity,price:price, amount:quantity*price};
   
    if(item === '' || quantity === '' || price === ''){
        return
    }
    marketList.push(listItem)



    console.log(marketList)

    renderItems(marketList)
    
})

const renderItems = (marketList) => {
    let ul = document.querySelector(".list-items");
    ul.innerHTML = ""
    marketList.forEach(listItem => {
        const li = document.createElement("li")
        li.setAttribute("class", "list-item")
        li.setAttribute("data-key", listItem.id)
        li.innerHTML = `  <input type="checkbox" name="selectAll" id="selectAll" class="checkbox">
                <p class="item">${listItem.item}</h4>
                <p class="desc">${listItem.description}</p>
                <p class="qty">${listItem.quantity}</p>
                <p class="price">&#8358 ${listItem.price}</p>
                <p class="amount">&#8358 ${listItem.amount}</p>`
        ul.appendChild(li)
    })

}

const qtyEvents = ['change', 'keyup'];

qtyEvents.forEach(event => {
    qty.addEventListener(event, () => {
        amount.value = qty.value*price.value
    })
})

qtyEvents.forEach(event => {
    price.addEventListener(event, () => {
        amount.value = qty.value*price.value
     });
})













