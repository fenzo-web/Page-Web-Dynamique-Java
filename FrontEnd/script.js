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

//             Creation Balise
let sectionPortfolio = document.getElementById("portfolio");
let figure = document.createElement("figure");
figure.innerHTML = template;

let gallery = document.querySelector(".gallery");
gallery.appendChild(figure);
