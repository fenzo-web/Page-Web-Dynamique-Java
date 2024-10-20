/***** Variables ****** */
let main = document.querySelector("main");
// Création Formulaire de connexion
let htmlLoginForm = ` 
<section id="login">
    <h2>Log in</h2>
    <form id="loginForm" action="submit" method="post">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="sophie.bluel@test.tld" required/>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="password" value="S0phie" required/>
        <input type="submit" value="Se connecter" />
        <p class="underline">Mot de passe oublié</p>
    </form>
    <p id="errorMessage" style="color: red; display: none;"></p>
</section>`;

main.innerHTML = htmlLoginForm;

const form = document.getElementById("loginForm");

const postUsers = async () => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupération des données du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Création de l'objet des données Users
    const dataUser = { email, password };

    try {
      // Appel de la fonction fetch
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données");
      }

      const data = await response.json();
      console.log("🚀 ~ Réponse de l'API:", data);

      // Enregistrement du token et redirection
      window.sessionStorage.loged = true;
      sessionStorage.setItem("token", data.token);
      window.location.href = "../index.html";
    } catch (error) {
      console.log("🚀 ~ Error:", error);
      document.getElementById("errorMessage").textContent =
        "Échec de la connexion. Vérifiez vos identifiants.";
      document.getElementById("errorMessage").style.display = "block";
    }
  });
};

postUsers();
