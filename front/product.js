const quantityUser = document.querySelector("#quantity"); // cree une constante de l'id quantity qui est un input, pour pouvoir le manipuler plus facilement
const colorUser = document.querySelector("#colors"); // cree une constante de l'id colors qui est l'option select, pour pouvoir le manipuler plus facilement

 
let productId = getProductId(); // cree une variable productId qui prendra comme valeur la fonction getProductId() qui permettra de recuperer tous les infos du produit de la page grace à cette variable
getProduct(productId); //appel de la fonction getProduct  avce la variable productId, pour recuperer du contenu en rapport avec l'id

function getProductId() {
  let stringUrl = window.location.href; // recuperer l'url complete dans la variable stringURL//
  let url = new URL(stringUrl); // formater l'url
  return url.searchParams.get("id"); // recuperer la valeur de l'id de la page grace  à searchParams.get, et l'inserer dans la variable productId //
}
// fonction qui recupere toute les données de l'api avec la variable productId, pour prendre du contenu en rapport avec la page produit getProductById
function getProduct(productId) {
  fetch("http://localhost:3000/api/products/" + productId)
    .then((res) => {
      return res.json();
    })

    .then(async function (result) {
      product = await result;
      console.table(product);
      if (product) {
        getProductContent(product);
      }
    })
    .catch((error) => {
      console.log("Error");
    });
}

function getProductColor(color) {
  for (let colorr of color) {
    productColor = document.createElement("option");
    document.querySelector("#colors").appendChild(productColor);
    productColor.value = colorr;
    productColor.innerHTML = colorr;
  }
}

function getProductContent(product) {
  let img = document.createElement("img");
  document.querySelector(".item__img").appendChild(img);
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  document.getElementById("title").textContent = product.name;
  document.getElementById("price").textContent = product.price;
  document.getElementById("description").textContent = product.description;
  getProductColor(product.colors);
  submitshopping(product);
}

function checkQuantity(quantity) {
  if (quantity > 0 && quantity <= 100 && quantity != 0) {
    return true;
  } else {
  }
}
// verifie si la couleur  a etait sélectionné, retourne true si la valeur du select option n'est pas vide
function checkColor(colorUser) {
  if (colorUser.value !== "") {
    return true;
  }
}
// initialisation du localStorage en Json
function initLocalStorage() {
  return JSON.parse(localStorage.getItem("product"));
}
//fonction qui ajoute des données au localstorage avec comme parametre productLocalStorage et productList
function pushProductLocalStorage(productLocalStorage, productList) {
  productLocalStorage.push(productList);
}
// fonction qui permet de mettre à jour le localStorage avec comme parametre productLocalStorage
function setProductLocalStorage(productLocalStorage) {
  localStorage.setItem("product", JSON.stringify(productLocalStorage));
  console.table(productLocalStorage);
}


function validationPopup(quantityChoice, product, colorChoice) {
  window.confirm(`Votre commande de:
      ${quantityChoice} ${product.name} de couleur ${colorChoice} à bien était ajouté au panier`);
}

function validationPopupUpdate(
  LocalStorageFind,
  quantityChoice,
  product,
  colorChoice
) {
  window.confirm(`Votre commande à etait mis à jour,  vous avez desormais
       ${localStorageFind.quantityList} ${product.name} de couleur ${colorChoice}`);
}

function checkProductExist(productList, productLocalStorage) {
  return productLocalStorage.find(
    (value) => value.id == productList.id && value.colorList == productList.colorList
  );
}
function addQuantityProduct(productList, localStorageFind) {
  return (
    parseInt(productList.quantityList) + parseInt(localStorageFind.quantityList)
  );
}

function submitshopping(product) {
  let submitform = document.querySelector("#addToCart");

  submitform.addEventListener("click", function (e) {
    quantity = quantityUser.value;

    if (checkQuantity(quantity) && checkColor(colorUser.value)) {
      if(colorUser.value ==""){
        alert("selectionner la couleur");
        return false;
       
      }
      colorChoice = colorUser.value;
      quantityChoice = quantity;

      let productList = {
        id: productId,
        colorList: colorChoice,
        quantityList: quantity
      };

      let productLocalStorage = initLocalStorage();

      if (productLocalStorage) {
          localStorageFind = checkProductExist(
            productList,
            productLocalStorage
          );
        if (localStorageFind) {
          localStorageFind.quantityList = addQuantityProduct(
            productList,
            localStorageFind
          );
          setProductLocalStorage(productLocalStorage);
          validationPopupUpdate(
            localStorageFind.quantityList,
            quantityChoice,
            product,
            colorChoice
          );
        } else {
          pushProductLocalStorage(productLocalStorage, productList);
          setProductLocalStorage(productLocalStorage);
          validationPopup(quantityChoice, product, colorChoice);
        }
      } else {
        productLocalStorage = [];
        pushProductLocalStorage(productLocalStorage, productList);
        setProductLocalStorage(productLocalStorage);
        validationPopup(quantityChoice, product, colorChoice);
      }
    } else {
      alert("Veuillez remplir ou corriger les champs invalide");
    }
  });
}
