let works = [];
console.log("🚀 ~ works:", works);

// Fetch
const myFetch = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    console.log("🚀 ~ myFetch ~ response:", response);
    if (response.ok) {
      const result = await response.json();
      console.log("🚀 ~ myFetch ~ result:", result);
      works = result;
      return result;
    } else {
      throw new Error("Error of fetch execution");
    }
  } catch (error) {
    console.log(error);
  }
};
const displayWork = (oneWork) => {
  console.log("🚀 ~ displayWork ~ oneWork:", oneWork);
  // identifier la cible
  // crer un element html figure
  // a l'interieur de figure ingeter le template
  // ingeter figure dans la cible
};
myFetch().then((data) => {
  data.forEach((work) => {
    displayWork(work);
  });
});
//          Template

let template = `
        <figure>
          <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina" />
          <figcaption>Abajour Tahina</figcaption>
        </figure>`;
let template2 = `
        <figure>
          <img src="assets/images/appartement-paris-v.png" alt="Appartement Paris V" />
          <figcaption>Appartement Paris V</figcaption>
        </figure>`;
let template3 = `
        <figure>
          <img src="assets/images/restaurant-sushisen-londres.png" alt="Restaurant Sushien Londres" />
          <figcaption>Restaurant Sushien Londres</figcaption>
        </figure>`;
let template4 = `
        <figure>
          <img src="assets/images/la-balisiere.png" alt="La Balisiere" />
          <figcaption>La Balisiere</figcaption>
        </figure>`;
let template5 = `
        <figure>
          <img src="assets/images/structures-thermopolis.png" alt="Structures Thermopolis" />
          <figcaption>Structures Thermopolis</figcaption>
        </figure>`;
let template6 = `
        <figure>
          <img src="assets/images/appartement-paris-x.png" alt="Appartement Paris X" />
          <figcaption>Appartement Paris X</figcaption>
        </figure>`;
let template7 = `
        <figure>
          <img src="assets/images/le-coteau-cassis.png" alt="Le coteau - Cassis" />
          <figcaption>Le coteau - Cassis</figcaption>
        </figure>`;
let template8 = `
        <figure>
          <img src="assets/images/villa-ferneze.png" alt="Villa Ferneze - Isola d’Elba" />
          <figcaption>Villa Ferneze - Isola d’Elba</figcaption>
        </figure>`;
let template9 = `
        <figure>
          <img src="assets/images/appartement-paris-xviii.png" alt="Appartement Paris XVIII" />
          <figcaption>Appartement Paris XVIII</figcaption>
        </figure>`;
let template10 = `
        <figure>
          <img src="assets/images/bar-lullaby-paris.png" alt="Bar “Lullaby” - Paris" />
          <figcaption>Bar “Lullaby” - Paris</figcaption>
        </figure>`;
let template11 = `
        <figure>
          <img src="assets/images/hotel-first-arte-new-delhi.png" alt="Hotel First Arte - New Delhi" />
          <figcaption>Hotel First Arte - New Delhi</figcaption>
        </figure>`;
const listeTemplate = [
  template,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
  template9,
  template10,
  template11,
];

//            Creation Balise
let sectionPortfolio = document.getElementById("portfolio");
let figure = document.createElement("figure");
figure.innerHTML = listeTemplate;

let gallery = document.querySelector(".gallery");
gallery.appendChild(figure);
