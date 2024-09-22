/**************   Variable   ***************/

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

/****************  Fetch Works ****************/
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getWorks();

/*********** Display Works  ************/
async function displayWorks() {
  const works = await getWorks();
  works.forEach((oneWork) => {
    createWorks(oneWork);
  });
}
displayWorks();

function createWorks(oneWork) {
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

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategorysButtons() {
  const categorys = await getCategorys();
  //console.log(categorys);
  categorys.forEach((oneCategory) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategory.name;
    btn.id = oneCategory.id;
    filters.appendChild(btn);
  });
}
displayCategorysButtons();

/******* Filtrages des buttons par categories ********/

async function filterCategory() {
  const allWorks = await getWorks();
  //console.log(allWorks);
  const buttons = document.querySelectorAll(".filters button");
  //console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id; /**Recuper l'ID au click **/
      gallery.innerHTML = ""; /** Supprime les photos au click **/
      if (btnId !== "0") {
        const allWorksTriCategory = allWorks.filter((oneWork) => {
          /**Trouver meilleur nom pour "all works / allWorksTri" ect */
          return oneWork.categoryId == btnId;
        });
        allWorksTriCategory.forEach((oneWork) => {
          createWorks(oneWork);
        });
      } else {
        displayWorks();
      }
      console.log(btnId);
    });
  });
}
filterCategory();
