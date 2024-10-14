/************************   Variable   ****************************/
const token = sessionStorage.getItem("token");
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

/**************************Test Function Initialisation 
 
 const initialisation = async () => {
  // TEST
  const data = getWorks();
  const parametres = 
  return { data, parametres};
}
 const display = async (data, parametres) => {

 }

 * **********************/

/*********************** Si utilisateur connecter *****************/
let htmlModifier = `
<i class="fa-regular fa-pen-to-square"></i>
<span>modifier</span>
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
    logout.innerHTML = `
    <li>
            <a href="log/login.html" class="logout">login</a>
          </li>
    `;
    displayCategoriesButtons().then(() => {
      filterCategory();
    });
    // action de deconnection
  });
  const modifier = document.createElement("span");
  modifier.innerHTML = htmlModifier;
  modifier.classList.add("admin-modifier");
  mesProjets.appendChild(modifier);
  // Modifier
  const modeEdition = document.createElement("div");
  modeEdition.innerHTML = htmlModeEdition;
  modeEdition.classList.add("mode-edition");
  header.prepend(modeEdition);
  header.classList.add("no-marge");
  // Mode Edition
}

/***************** Modal **********************/
const modifier = document.querySelector(".admin-modifier");
const modal = document.querySelector(".modal");
const xmark = document.querySelector(".modal .fa-xmark");
const galeryModal = document.querySelector(".galery-modal");

modifier.addEventListener("click", () => {
  displayWorksModal();
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
  allWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    trash.dataset.toto = work.id;
    img.src = work.imageUrl;
    trash.addEventListener("click", () => {
      deleteWorkModal(work.id);
      figure.style.display = "none";
    });
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    galeryModal.appendChild(figure);
  });
};

// Suppression d'une image dans la modal

const deleteWorkModal = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Problem");
        return;
      }
      return response.json(); // consol montre une erreur syntaxx
    })
    .then((data) => {
      console.log("Sucess", data);
    })
    .catch((error) => {
      console.log(error);
    });
};

/************** Faire le switch des modales ***************/
const btnAddModal = document.querySelector(".modal-wrapper .button");
const modalAddWork = document.querySelector(".modal-add-work");
const modalWrapper = document.querySelector(".modal-wrapper");
const arrowLeft = document.querySelector(".fa-arrow-left");
const markAdd = document.querySelector(".modal-add-work .fa-xmark");

const displayAddModal = () => {
  btnAddModal.addEventListener("click", () => {
    modalAddWork.style.display = "flex";
    modalWrapper.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAddWork.style.display = "none";
    modalWrapper.style.display = "flex";
  });
  markAdd.addEventListener("click", () => {
    modal.style.display = "none";
  });
};
displayAddModal();

/********** Previsualisation de l'image **************/
const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconeFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");

// Ecouter les changements input

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconeFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Liste Category dans input Select

const displayCategoriesModal = async () => {
  const select = document.querySelector(".modal-add-work select");
  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
};
displayCategoriesModal();

/********** Post Work ********/
const form = document.querySelector(".modal-add-work form");
const title = document.querySelector(".modal-add-work #title");
const categoryModal = document.querySelector(".modal-add-work #category");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("voici le work ajouté", data);
      displayWorksModal();
    });
});

// Verification de conformité
const verifForm = async () => {
  const buttonValidForm = document.querySelector(
    `.modal-add-work  input[type="submit"]`
  );
  form.addEventListener("input", () => {
    if (!title.value == "" && !category.value == "" && !inputFile.value == "") {
      buttonValidForm.style.backgroundColor = "#1d6154";
      buttonValidForm.disabled = false;
    } else {
      buttonValidForm.style.backgroundColor = "#a7a7a7";
      buttonValidForm.disabled = true;
    }
  });
};
verifForm();
