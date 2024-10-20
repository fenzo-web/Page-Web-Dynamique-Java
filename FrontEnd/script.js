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
let htmlModifier = `
<i class="fa-regular fa-pen-to-square"></i>
<span>modifier</span>
`;
let htmlModeEdition = `
<i class="fa-regular fa-pen-to-square"></i>
<p>Mode édition</p>
`;
const galeryModal = document.querySelector(".galery-modal");
const modal = document.querySelector(".modal");
const xmark = document.querySelector(".modal .fa-xmark");

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

const createWork = (oneWork) => {
  const figure = document.createElement("figure");
  figure.dataset.id = oneWork.id;
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

/********* Si connecter *********/
const modeEdition = document.querySelector(".mode-edition");
// Fonction pour créer les éléments d'administration
const createAdminElements = () => {
  const modifier = document.createElement("span");
  modifier.innerHTML = htmlModifier;
  modifier.classList.add("admin-modifier");
  mesProjets.appendChild(modifier);

  modifier.addEventListener("click", async () => {
    await displayWorksModal();
    modal.style.display = "flex";
  });

  xmark.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const modeEdition = document.createElement("div");
  modeEdition.innerHTML = htmlModeEdition;
  modeEdition.classList.add("mode-edition");
  header.prepend(modeEdition);
  header.classList.add("no-marge");
};

// Fonction pour configurer le logout
const configureLogout = () => {
  const logoutLink = document.querySelector("header nav .logout");
  logoutLink.textContent = "logout";
  logoutLink.removeAttribute("href");

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();

    sessionStorage.removeItem("token");

    const modeEdition = document.querySelector(".mode-edition");
    const modifier = document.querySelector(".admin-modifier");

    modeEdition.classList.add("display-none");
    modifier.classList.add("display-none");
    header.classList.remove("no-marge");

    // Changer le contenu du bouton
    logoutLink.innerHTML = `
      <li>
        <a href="#" class="login">login</a>
      </li>
    `;

    // Réaffecter le nouvel élément pour le gestionnaire d'événements
    const loginLink = document.querySelector("header nav .login");
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "log/login.html"; // Redirection vers la page de connexion
    });
    displayCategoriesButtons().then(() => {
      filterCategory();
    });
  });
};
/***********Affichage des Works dans la Modal*************/
const displayWorksModal = async () => {
  galeryModal.innerHTML = "";
  allWorks.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    trash.dataset.toto = work.id;
    img.src = work.imageUrl;
    trash.addEventListener("click", () => {
      deleteWorkModal(work.id);
      const worksToDelete = document.querySelectorAll(
        `figure[data-id="${work.id}"]`
      );
      worksToDelete.forEach(
        (workToDelete) => (workToDelete.style.display = "none")
      );
      const filteredAllWorks = allWorks.filter(
        (itemWork) => itemWork.id !== work.id
      );
      console.log(
        "🚀 ~ trash.addEventListener ~ filteredAllWorks:",
        filteredAllWorks
      );
      allworks = filteredAllWorks;
    });
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    galeryModal.appendChild(figure);
  });
};

/*********Suppression d'une image dans la modal***********/

const deleteWorkModal = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (response) => {
      if (!response.ok) {
        console.log("Problem");
        return;
      }
      // Mettre à jour allWorks pour exclure le travail supprimé
      allWorks = allWorks.filter((work) => work.id !== id);
      console.log(response);
      return response;
    })
    .then((data) => {
      console.log("Sucess", data);
      return data;
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

/********** Previsualisation de l'image **************/
const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconeFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");

/*****Ecouter les changements input*******/

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];

  if (file) {
    // Vérification du format de fichier
    const validFormats = ["image/jpeg", "image/png"];
    if (!validFormats.includes(file.type)) {
      alert("Veuillez sélectionner une image au format JPG ou PNG.");
      inputFile.value = ""; // Réinitialise le champ de fichier
      return;
    }

    // Vérification de la taille de l'image (4 Mo = 4 * 1024 * 1024 octets)
    const maxSize = 4 * 1024 * 1024; // 4 Mo
    if (file.size > maxSize) {
      alert("La taille de l'image ne doit pas dépasser 4 Mo.");
      inputFile.value = ""; // Réinitialise le champ de fichier
      return;
    }

    // Prévisualisation de l'image si tout est correct
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

/********** Liste Category dans input Select *************/

const displayCategoriesModal = async () => {
  const select = document.querySelector(".modal-add-work select");

  // Fonction pour charger les catégories
  const loadCategories = async () => {
    select.innerHTML = ""; // Vide les options existantes

    try {
      const categories = await getCategories();
      const filteredCategories = categories.slice(1); // Exclure le premier élément

      filteredCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  // Écoute l'événement "click" sur le select
  select.addEventListener("click", () => {
    if (select.children.length === 0) {
      // Charge les catégories seulement si aucune option n'est présente
      loadCategories();
    }
  });
};

/********** Post Work ********/
const form = document.querySelector(".modal-add-work form");
const titleInput = document.querySelector(".modal-add-work #title");
const categorySelect = document.querySelector(".modal-add-work #category");

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
      // displayWorksModal();
      // displayWorks();
    });
});

/********** Verification de conformité *************/
const verifForm = () => {
  const buttonValidForm = document.querySelector(
    `.modal-add-work input[type="submit"]`
  );

  const validateForm = () => {
    const isTitleValid = titleInput.value.trim() !== ""; // Vérifie que le titre n'est pas vide
    const isFileValid = inputFile.files.length > 0; // Vérifie qu'un fichier est sélectionné
    const isCategoryValid = categorySelect.value !== ""; // Vérifie qu'une catégorie est sélectionnée

    if (isTitleValid && isFileValid && isCategoryValid) {
      buttonValidForm.style.backgroundColor = "#1d6154";
      buttonValidForm.disabled = false;
    } else {
      buttonValidForm.style.backgroundColor = "#a7a7a7";
      buttonValidForm.disabled = true;
    }
  };

  // Ajoute des écouteurs d'événements pour les changements sur les champs
  titleInput.addEventListener("input", validateForm);
  inputFile.addEventListener("change", validateForm);
  categorySelect.addEventListener("change", validateForm);

  // Appel initial pour définir l'état du bouton au chargement
  validateForm();
};

/**************************Function Initialisation **********************/

const init = async () => {
  // Récupérer les informations de connexion
  const loged = isConnect();
  //Recuperation des travaux
  await getWorks;
  // Afficher les travaux
  await displayWorks();

  // Afficher les boutons de catégories si l'utilisateur n'est pas connecté
  if (!loged) {
    await displayCategoriesButtons();
    filterCategory();
  }

  // Configuration Connext
  if (loged) {
    configureLogout();
    createAdminElements();
  }

  // Afficher les catégories dans le modal
  await displayCategoriesModal();

  // Afficher les événements de la modal d'ajout
  displayAddModal();
  await displayWorksModal();

  // Vérifier la conformité du formulaire
  await verifForm();
};

// Appeler la fonction init pour démarrer l'application
init();
