let cardProduct = document.querySelector("#cart__items");
let productLocalStorage = initLocalStorage();
console.table(productLocalStorage);
getAllProductCard();

function initLocalStorage() {
  return JSON.parse(localStorage.getItem("product"));
}

function deletePageCard() {
  const elementDelete = document.querySelector(".cart");
  return elementDelete.remove();
}

function getAllProductCard() {
  if (productLocalStorage == null || productLocalStorage == 0) {
    deletePageCard();
    document.querySelector("h1").textContent = "Votre panier est vide";
  } else {
    fetch("http://localhost:3000/api/products/")
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then (async function getItem(data) {
        products = productLocalStorage;
        searchProductItemById(data, products);
        deleteProductCard();
        modifyQuantityProductCard();
        computeTotalQuantity();
        await computeTotalPrice(); //totalQuantityProduct(data, products);
        
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

function searchProductItemById(api, products) {
  show = "";
  for (let product of products) {
    for (let data of api) {
      if (product.id === data._id) {
        show += constructProductHtml(product, data);
      }
    }
    document.querySelector("#cart__items").innerHTML = show;
  }
}

function constructProductHtml(product, data) {
  let producthtml = `<article class="cart__item" data-id="${data._id}" data-color="${product.colorList}">
    <div class="cart__item__img">
    <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>couleur ${product.colorList}</p>
        <p>${data.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${product.quantityList} </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantityList}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;

  return producthtml;
}

function deleteProductCard() {
  deleteButton = document.querySelectorAll(".deleteItem");
  for (i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click",async (e) => {
      e.preventDefault();
      const article = e.target.closest("article");
      const id = article.dataset.id;
      const color = article.dataset.color;
      console.log(id, color);
      article.remove();
      deleteItem(id, color);
      computeTotalQuantity();
      await computeTotalPrice();
    });
  }
}

function deleteItem(id, color) {
  productLocalStorage = productLocalStorage.filter(
    (v) => v.id !== id || v.colorList !== color
  );
  setProductLocalStorage(productLocalStorage);
}

function setProductLocalStorage(productLocalStorage) {
  localStorage.setItem("product", JSON.stringify(productLocalStorage));
  console.table(productLocalStorage);
}

 function modifyQuantityProductCard() {
  inputQuantity = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < inputQuantity.length; i++) {
    inputQuantity[i].addEventListener("change", async (e) => {
      let products = JSON.parse(localStorage.getItem("product"));
      const article = e.target.closest("article");
      const id = article.dataset.id;
      const color = article.dataset.color;
      const quantity = e.target.value;
      const quantityLabel = e.target.previousElementSibling;
      quantityLabel.innerHTML = "Qté :" + quantity;
      let resultProducts = products.find(
        (v) => v.id == id && v.colorList == color
      );
      resultProducts.quantityList = quantity;
      console.log(products);
      setProductLocalStorage(products);
      computeTotalQuantity();
      await computeTotalPrice();
    });
  }
}

async function getProductById(id) {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  const dataApi = await response.json();
  return dataApi;
}

async function computeTotalPrice() {
  let products = JSON.parse(localStorage.getItem("product"));

  totalPrice = 0;
  for (let i = 0; i < products.length; i++) {
    const product = await getProductById(products[i].id);
    totalPrice += product.price * products[i].quantityList;
  }
  let totalPriceHtml = document.querySelector("#totalPrice");
  totalPriceHtml.innerHTML = totalPrice;
}



function computeTotalQuantity() {
  totalQuantity = 0;
  let products = JSON.parse(localStorage.getItem("product"));
  for (let i = 0; i < products.length; i++) {
    totalQuantity += parseInt(products[i].quantityList);
  }

  let totalQuantityHtml = document.querySelector("#totalQuantity");
  totalQuantityHtml.innerHTML = totalQuantity;
}


function testFirstName(firstName) {

  let regex = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{3,10}$/.test(firstName);

  if (!regex) {
     
    document.getElementById("firstNameErrorMsg").textContent = "Prénom invalide";
    return false;
  }
    document.getElementById("firstNameErrorMsg").textContent = "";
    return true;
 
  }



function testName(name) {

  let regex = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{3,10}$/.test(name);

  if (!regex) {
    document.getElementById("lastNameErrorMsg").textContent = "Nom invalide";
    return false;
  }
  
  document.getElementById("lastNameErrorMsg").textContent = "";
  return true;
}


function testlocation(adresse) {

  let regex = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(adresse);

  if (!regex) {
    document.getElementById("addressErrorMsg").textContent = "Adresse invalide";
    return false;
    
  }
  document.getElementById("addressErrorMsg").textContent = "";
  return true;

}


function testcity(ville) {

  let regex = /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/.test(ville);

  if (!regex) {
    document.getElementById("cityErrorMsg").textContent = "Ville invalide";
   return false;
  }
  document.getElementById("cityErrorMsg").textContent = "";
  return true;
}


function testemail(email) {

  let regex = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(email);

  if (!regex) {
    document.getElementById("emailErrorMsg").textContent = "Email invalide";
    return false;


  }
  document.getElementById("emailErrorMsg").textContent = "";
   return true;
}



const order = () => {


  const orderBtn = document.getElementById("order");

  orderBtn.addEventListener("click", (e) => {
  

    let contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };

       


       
    if (
      (testFirstName(contact.firstName)) &&
      (testName(contact.lastName)) &&
      (testlocation(contact.address)) &&
      (testcity(contact.city)) &&
      (testemail(contact.email))
    ) {
     
      e.preventDefault();
      let productLocalStorage = initLocalStorage();
      let arrayProduct = [];

      
      for (let product of productLocalStorage) {
        arrayProduct.push(product.id);

      }

      
      arrayProduct = [...new Set(arrayProduct)];

      console.log(arrayProduct);
      console.log(contact);
      alert("Commande effectuée !");


      

      
      const order = {
        contact,
        products: arrayProduct,
      };


      
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", 
        },
      };

      
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          
          document.location.href = "confirmation.html?id=" + data.orderId;
        })
        
        .catch((err) => {
          console.log("Erreur dans la requête : " + err.message);
        });

    } else {
      e.preventDefault();
      console.log("Veuillez remplir correctement le formulaire");
    }
  });
};

order();
