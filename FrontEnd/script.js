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
/******** Modal *********/
const galeryModal = document.querySelector(".galery-modal");
const modal = document.querySelector(".modal");
const xmark = document.querySelector(".modal .fa-xmark");
const form = document.querySelector(".modal-add-work form");
const btnAddModal = document.querySelector(".modal-wrapper .button");
const modalAddWork = document.querySelector(".modal-add-work");
const modalWrapper = document.querySelector(".modal-wrapper");
const arrowLeft = document.querySelector(".fa-arrow-left");
const markAdd = document.querySelector(".modal-add-work .fa-xmark");
/****** Admin ****/
const modeEdition = document.querySelector(".mode-edition");
/********** Previsualisation de l'image **************/
const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconeFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");
/******* Ecoute des inputes */
const titleInput = document.querySelector(".modal-add-work #title");
const categorySelect = document.querySelector(".modal-add-work #category");

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

/***************** Fonction pour créer un élément ******************/
const createWorkElement = (work, isModal = false) => {
  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;

  figure.appendChild(img);

  if (!isModal) {
    // Ajouter le titre seulement si ce n'est pas dans la modal
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);
  } else {
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;

    trash.addEventListener("click", () => {
      deleteWorkModal(work.id);
      const worksToDelete = document.querySelectorAll(
        `figure[data-id="${work.id}"]`
      );
      worksToDelete.forEach((workToDelete) => {
        workToDelete.style.display = "none";
      });
      allWorks = allWorks.filter((itemWork) => itemWork.id !== work.id);
      console.log("🚀 ~ trash.addEventListener ~ updated allWorks:", allWorks);
    });

    span.appendChild(trash);
    figure.appendChild(span);
  }

  return figure;
};
/****************************** Display Works  *****************************/

// Fonction pour afficher les œuvres dans la galerie principale
const displayWorks = async () => {
  allWorks.forEach((oneWork) => {
    const workElement = createWorkElement(oneWork); // false par défaut
    gallery.appendChild(workElement);
  });
};

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
  // Vider les boutons existants avant de les ajouter
  filters.innerHTML = "";
  categories.forEach((oneCategory) => {
    const btn = document.createElement("button");
    btn.textContent = oneCategory.name;
    btn.id = oneCategory.id;
    btn.classList.add("categories");
    if (loged == "true") {
      btn.classList.add("hidden");
    }
    filters.appendChild(btn);
  });
};

/********** Verification de conformité *************/
const verifForm = () => {
  const buttonValidForm = document.querySelector(
    `.modal-add-work input[type="submit"]`
  );

  const isTitleValid = titleInput.value.trim() !== ""; // Vérifie que le titre n'est pas vide
  console.log("🚀 ~ verifForm ~ isTitleValid:", isTitleValid);
  const isFileValid = inputFile.files.length > 0; // Vérifie qu'un fichier est sélectionné
  console.log("🚀 ~ verifForm ~ isFileValid:", isFileValid);
  const isCategoryValid = categorySelect.value !== ""; // Vérifie qu'une catégorie est sélectionnée
  console.log("🚀 ~ verifForm ~ isCategoryValid:", isCategoryValid);

  if (isTitleValid && isFileValid && isCategoryValid) {
    buttonValidForm.style.backgroundColor = "#1d6154";
    buttonValidForm.disabled = false;
  } else {
    buttonValidForm.style.backgroundColor = "#a7a7a7";
    buttonValidForm.disabled = true;
  }
};

/************************* Filtrages des buttons par categories *********************/

const filterCategory = async () => {
  const buttons = document.querySelectorAll(".filters button");

  // Ajout categories-all au boutton Tous au debut
  if (buttons.length > 0) {
    buttons[0].classList.add("categories-all");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Ajout des couleurs au button au click
      buttons.forEach((btn) => btn.classList.remove("categories-all"));
      e.target.classList.add("categories-all");
      // Gestion des ID
      const btnId = Number(e.target.id); /**Recuper l'ID au click **/
      gallery.innerHTML = ""; /** Supprime les photos au click **/
      // Filtrage des œuvres
      const filteredWorks =
        btnId !== 0
          ? allWorks.filter((oneWork) => oneWork.categoryId === btnId)
          : allWorks;

      // Affichage des œuvres filtrées
      filteredWorks.forEach((oneWork) => {
        const workElement = createWorkElement(oneWork); // Crée l'élément
        gallery.appendChild(workElement); // Ajoute à la galerie
      });
      console.log(btnId);
    });
  });
};

/********* Ouverture et fermeture Modal *********/
const closeModal = () => {
  modal.style.display = "none";
  form.reset();
};
const openModal = () => {
  modal.style.display = "flex";
  modalAddWork.style.display = "none";
  modalWrapper.style.display = "flex";
};

/******* Mode Admin*****/

// Fonction pour créer les éléments d'administration
const createAdminElements = () => {
  const modifier = document.createElement("span");
  modifier.innerHTML = htmlModifier;
  modifier.classList.add("admin-modifier");
  mesProjets.appendChild(modifier);

  modifier.addEventListener("click", async () => {
    await displayWorksModal();
    openModal();
  });

  xmark.addEventListener("click", () => closeModal());

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
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

  logoutLink.addEventListener("click", async (e) => {
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

    // Afficher les catégories
    await displayCategoriesButtons();
    filterCategory();

    // Réaffecter le nouvel élément pour le gestionnaire d'événements sur le lien de connexion
    const loginLink = document.querySelector("header nav .login");
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "log/login.html"; // Redirection vers la page de connexion
    });
  });
};
/***********Affichage des Works dans la Modal*************/

// Fonction pour afficher les œuvres dans la modal
const displayWorksModal = async () => {
  galeryModal.innerHTML = "";
  allWorks.forEach((work) => {
    const workElement = createWorkElement(work, true); // true pour la modal
    galeryModal.appendChild(workElement);
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

const displayAddModal = () => {
  btnAddModal.addEventListener("click", () => {
    modalAddWork.style.display = "flex";
    modalWrapper.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAddWork.style.display = "none";
    modalWrapper.style.display = "flex";
  });
  markAdd.addEventListener("click", () => closeModal());
};

/********** Previsualisation de l'image **************/

/*****Ecouter les changements input*******/

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  const errorMessageContainer = document.getElementById("error-message");

  errorMessageContainer.innerHTML = "";
  let isValid = true; // Variable pour suivre la validité du fichier

  if (file) {
    // Vérification du format de fichier
    const validFormats = ["image/jpeg", "image/png"];
    if (!validFormats.includes(file.type)) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Veullez Selectionner une image au format JPG ou PNG.";
      errorMessage.style.color = "red";
      errorMessageContainer.appendChild(errorMessage);
      inputFile.value = ""; // Réinitialise le champ de fichier
      isValid = false; // Marquer comme Invalide
    }

    // Vérification de la taille de l'image (4 Mo = 4 * 1024 * 1024 octets)
    const maxSize = 4 * 1024 * 1024; // 4 Mo
    if (file.size > maxSize) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "La taille de l'image ne doit pas dépasser 4Mo.";
      errorMessage.style.color = "red";
      errorMessageContainer.appendChild(errorMessage);
      inputFile.value = ""; // Réinitialise le champ de fichier
      isValid = false; // Marquer comme
    }
    // Prévisualisation de l'image si tout est correct
    if (isValid) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result; // Met à jour la source de l'image
        previewImg.style.display = "flex"; // Affiche la prévisualisation
        labelFile.style.display = "none"; // Cache le label
        iconeFile.style.display = "none"; // Cache l'icône
        pFile.style.display = "none"; // Cache le texte d'instruction
      };
      reader.readAsDataURL(file);
    }
  }
  verifForm();
});

/********** Liste Category dans input Select *************/

const displayCategoriesModal = async () => {
  const select = document.querySelector(".modal-add-work select");

  // Fonction pour charger les catégories
  const loadCategories = async () => {
    select.innerHTML = ""; // Vide les options existantes

    try {
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

titleInput.addEventListener("input", verifForm);
categorySelect.addEventListener("input", verifForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form); // FormData

  // Envoi de la requête
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du work");
      }
      return response.json();
    })
    .then((data) => {
      allWorks.push(data); // Ajout du work à la liste allWorks

      // Créer et ajouter le nouvel élément à la galerie
      const newWorkElement = createWorkElement(data, false); // false pour ajouter le titre
      gallery.appendChild(newWorkElement); // Ajoute le nouvel élément à la galerie
      console.log("Voici le work ajouté", data);
      //Fermuture de la modal
      closeModal();
    })
    .catch((error) => {
      console.error("Erreur: Erreur dans les données Envoyer", error);
    });
});

/**************************Function Initialisation **********************/

const init = async () => {
  // Récupérer les informations de connexion
  const loged = isConnect();
  //Recuperation des travaux
  const worksPromise = getWorks();
  // Recuperation des Categories
  const categoriesPromise = getCategories();
  //Mise en Place  PROMISE ALL
  await Promise.all([worksPromise, categoriesPromise])
    .then(() => {
      // Affichages Travaux
      displayWorks();
      console.log("works", allWorks);
      console.log("categories", categories);
    })
    .catch((error) => {
      console.error("Error", error);
    });

  // Afficher les boutons de catégories si l'utilisateur n'est pas connecté
  if (!loged) {
    await displayCategoriesButtons();
    filterCategory();
  }

  // Configuration Connext
  if (loged) {
    configureLogout();
    createAdminElements();
    // Afficher les catégories dans le modal
    await displayCategoriesModal();

    // Afficher les événements de la modal d'ajout
    displayAddModal();
    await displayWorksModal();
  }
};

// Appeler la fonction init pour démarrer
init();
