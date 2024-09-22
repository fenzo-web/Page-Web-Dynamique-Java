/**************   Variable   ***************/

let works = [];
//console.log("🚀 ~ works:", works);
let sectionPortfolio = document.getElementById("portfolio");
let gallery = document.querySelector(".gallery");
let filters = document.querySelector(".filters");

/****************  Fetch Works ****************/
const getWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    //console.log("🚀 ~ getWorks ~ response:", response);
    if (response.ok) {
      const result = await response.json();
      //console.log("🚀 ~ getWorks ~ result:", result);
      works = result;
      return result;
    } else {
      throw new Error("Error of fetch execution");
    }
  } catch (error) {
    console.log(error);
  }
};
getWorks().then((data) => {
  data.forEach((work) => {
    displayWork(work);
  });
});
/***********  Display Work  **************/

const displayWork = (oneWork) => {
  //console.log("🚀 ~ displayWork ~ oneWork:", oneWork);
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  img.src = oneWork.imageUrl;
  let figcaption = document.createElement("figcaption");
  figcaption.innerText = oneWork.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
};

/*******    Display Button Categories     ********/

/******* Fetch Categories *********/

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategoriesButtons() {
  const categories = await getCategories();
  //console.log(categories);
  categories.forEach((oneCategorie) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategorie.name;
    btn.id = oneCategorie.id;
    filters.appendChild(btn);
  });
}
displayCategoriesButtons();

/******* Filtrages des buttons par categories ********/

async function filterCategorie() {
  const allWorks = await getWorks();
  //console.log(allWorks);
  const buttons = document.querySelectorAll(".filters button");
  //console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id; /**Recuper l'ID au click **/
      gallery.innerHTML = ""; /** Supprime les photos au click **/
      if (btnId !== "0") {
        const allWorksTriCategorie = allWorks.filter((oneWork) => {
          /**Trouver meilleur nom pour "all works / allWorksTri" ect */
          return oneWork.categoryId == btnId;
        });
        allWorksTriCategorie.forEach((oneWork) => {
          displayWork(oneWork);
        });
      } else {
      }
      console.log(btnId);
    });
  });
}
filterCategorie();
