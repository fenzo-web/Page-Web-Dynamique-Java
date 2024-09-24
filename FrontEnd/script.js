/**************   Variable   ***************/

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
let allWorks = [];
let categories = [];

/****************  Fetch Works  ****************/

const getWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
      const result = await response.json();
      allWorks = result;
      return result;
    } else {
      throw new Error("Error of fetch execution");
    }
  } catch (error) {
    console.log(error);
  }
};
/*********** Display Works  ************/
const displayWorks = async () => {
  await getWorks();
  allWorks.forEach((oneWork) => {
    createWork(oneWork);
  });
};
displayWorks();

const createWork = (oneWork) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = oneWork.imageUrl;
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = oneWork.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
};

/*******    Display Button Categories     ********/

/******* Fetch Categories *********/

const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();
  categories.unshift({
    /** unshift est un push en debut du tableau **/ id: 0,
    name: "Tous",
  });
};

const displayCategoriesButtons = async () => {
  await getCategories();
  //console.log(categories);
  categories.forEach((oneCategory) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategory.name;
    btn.id = oneCategory.id;
    filters.appendChild(btn);
  });
};

/******* Filtrages des buttons par categories ********/

const filterCategory = async () => {
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
};
displayCategoriesButtons().then(() => {
  filterCategory();
});
