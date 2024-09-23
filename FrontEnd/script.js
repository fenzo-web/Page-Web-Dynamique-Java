/**************   Variable   ***************/

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
let allWorks = [];
let categories = [];

/****************  Fetch Works ****************/
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  allWorks = await response.json();
}
//getWorks();

/*********** Display Works  ************/
async function displayWorks() {
  await getWorks();
  allWorks.forEach((oneWork) => {
    createWork(oneWork);
  });
}
displayWorks();

function createWork(oneWork) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = oneWork.imageUrl;
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = oneWork.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

/*******    Display Button Categories     ********/

/******* Fetch Categories *********/

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();
  categories.unshift({
    /** unshift est un push en debut du tableau **/ id: 0,
    name: "Tous",
  });
}

async function displayCategoriesButtons() {
  await getCategories();
  //console.log(categories);
  categories.forEach((oneCategory) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategory.name;
    btn.id = oneCategory.id;
    filters.appendChild(btn);
  });
}

/******* Filtrages des buttons par categories ********/

async function filterCategory() {
  //const allWorks = await getWorks();
  //console.log(allWorks);
  const buttons = document.querySelectorAll(".filters button");
  console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = Number(e.target.id); /**Recuper l'ID au click **/
      console.log("🚀 ~ button.addEventListener ~ btnId:", btnId);
      gallery.innerHTML = ""; /** Supprime les photos au click **/
      if (btnId !== 0) {
        const filteredWorks = allWorks.filter(
          (oneWork) => oneWork.categoryId === btnId
        );
        filteredWorks.forEach((oneWork) => {
          createWork(oneWork);
        });
      } else {
        allWorks.forEach((oneWork) => {
          createWork(oneWork);
        });
      }
      console.log(btnId);
    });
  });
}
displayCategoriesButtons().then(() => {
  filterCategory();
});
