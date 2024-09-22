/*   Variable   */

let works = [];
console.log("🚀 ~ works:", works);
let sectionPortfolio = document.getElementById("portfolio");
let gallery = document.querySelector(".gallery");

/* Fetch Works */
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

/* Display Work  */

const displayWork = (oneWork) => {
  console.log("🚀 ~ displayWork ~ oneWork:", oneWork);
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  img.src = oneWork.imageUrl;
  let figcaption = document.createElement("figcaption");
  figcaption.innerText = oneWork.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
};
myFetch().then((data) => {
  data.forEach((work) => {
    displayWork(work);
  });
});
