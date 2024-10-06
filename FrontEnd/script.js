/************************   Variable   ****************************/

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
let allWorks = [];
let categories = [];
let mesProjets = document.querySelector(".mes-projets");
const header = document.querySelector("header");
const logout = document.querySelector("header nav .logout");
const isConnect = () => {
  const token = sessionStorage.getItem("token");
  console.log("🚀 ~ isConnect ~ token:", !!token);
  return !!token;
};
const loged = isConnect();

/****************************  Fetch Works  **************************/

async function getWorks() {
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
}
/****************************** Display Works  *****************************/
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

/************************    Display Button Categories     ************************/

/************************* Fetch Categories ************************/

const getCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
      const result = await response.json();
      categories = result;
      categories.unshift({
        /** unshift est un push en debut du tableau **/ id: 0,
        name: "Tous",
      });
      return result;
    } else {
      throw new Error("Error of fetch execution");
    }
  } catch (error) {
    console.log(error);
  }
};

const displayCategoriesButtons = async () => {
  await getCategories();
  //console.log(categories);
  categories.forEach((oneCategory) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategory.name;
    btn.id = oneCategory.id;
    btn.classList.add("categories");
    if (loged == "true") {
      btn.classList.add("hidden");
    }
    // Tentative pour changer juste le TOUS

    filters.appendChild(btn);
  });
};

/************************* Filtrages des buttons par categories *********************/

const filterCategory = async () => {
  //const allWorks = await getWorks();
  //console.log(allWorks);
  const buttons = document.querySelectorAll(".filters button");
  //console.log(buttons);
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
if (!loged) {
  displayCategoriesButtons().then(() => {
    filterCategory();
  });
}
// fonction a appeler quand je me deconnect pour faire apparaitre les categories

/*********************** Si utilisateur connecter *****************/
let htmlModifier = `
<i class="fa-regular fa-pen-to-square"></i>
<p>modifier</p>
`;
let htmlModeEdition = `
<i class="fa-regular fa-pen-to-square"></i>
<p>Mode édition</p>
`;

if (loged) {
  logout.textContent = "logout";
  logout.removeAttribute("href");
  logout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    modeEdition.classList.add("display-none");
    modifier.classList.add("display-none");
    header.classList.remove("no-marge");
    // Changer le button logout en login
    displayCategoriesButtons().then(() => {
      filterCategory();
    });
    // action de deconnection
  });
  const modifier = document.createElement("div");
  modifier.innerHTML = htmlModifier;
  modifier.classList.add("admin-modifier");
  filters.appendChild(modifier);
  // Attention le modifier n'est pas a la bonne place
  const modeEdition = document.createElement("div");
  modeEdition.innerHTML = htmlModeEdition;
  modeEdition.classList.add("mode-edition");
  header.prepend(modeEdition);
  header.classList.add("no-marge");
  // Attention le mode edition n'est pas a la bonne place
}

/***************** Modal **********************/
const modifier = document.querySelector(".admin-modifier");
const modal = document.querySelector(".modal");
const xmark = document.querySelector(".modal .fa-xmark");
const galeryModal = document.querySelector(".galery-modal");

modifier.addEventListener("click", () => {
  modal.style.display = "flex";
});

xmark.addEventListener("click", () => {
  modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
  if (e.target.className == "modal") {
    modal.style.display = "none";
  }
});
window.addEventListener("keydown", function (e) {
  // close modal sur button Echap
  if (e.key === "Escape" || e.key === "Esc") {
    modal.style.display = "none";
  }
});
// Affichage des Works dans la Modal
const displayWorksModal = async () => {
  galeryModal.innerHTML = "";
  const galeryPhoto = await getWorks();
  galeryPhoto.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    img.src = work.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    galeryModal.appendChild(figure);
  });
  //deleteWorkModal(); En attente de reussite du delete
};
displayWorksModal();

// Suppression d'une image dans la modal
/**** const deleteWorkModal = () => {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
      };
      fetch("http://localhost:5678/api/works/{id}")
        .then((response) => {
          if (!response.ok) {
            console.log("Erreur lors du delete ! ");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Delete Reussi !", data);
          displayWorksModal;
          displayWorks;
        });
    });
  });
}; ***********/
// Erreur lors du delete
