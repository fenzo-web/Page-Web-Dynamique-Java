/***** Varaible *******/
let main = document.querySelector("main");
// Création Formulaire de connexion
let htmlLoginForm = ` 
<section id="login">
    <h2>Log in</h2>
    <form action="submit" method="post">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="sophie.bluel@test.tld" required/>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="password" value="S0phie" required/>
        <input type="submit" value="Se connecter" />
        <p class="underline">Mot de passe oublié</p>
    </form>
</section>`;

main.innerHTML = htmlLoginForm;

const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form");

/******** Post Users ************/

const postUsers = async () => {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Recuperation donnés du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Création de l'objet des données Users
    const dataUser = {
      email: email,
      password: password,
    };
    // Création de la charge utile au format json
    const chargeUtile = JSON.stringify(dataUser);
    // Appel de la fonction fecth avec tous les informations nécessaires
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'envoie des données");
        }
      })
      .then((dataUser) => {
        console.log("🚀 ~ Reponse de l'API:", dataUser);
        // je peux normalement faire quelque chose avec la reponse ici
        window.sessionStorage.loged = true;
        sessionStorage.setItem("token", dataUser.token);
        window.location.href = "../index.html";
      })
      .catch((error) => {
        console.log("🚀 ~ Error:", error);
      });
  });
};
postUsers();
