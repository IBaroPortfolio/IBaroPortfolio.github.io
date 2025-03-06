import './Components/index.js'
import translations from "./translations.js";

// Obtener el idioma almacenado o predeterminar a inglés
let language = localStorage.getItem("language") || "en";


// Función para actualizar los textos traducidos
function updateTranslations() {
  
  document.querySelectorAll("[data-translation]").forEach((element) => {
  
    const translationKey = element.getAttribute("data-translation");
    const keys = translationKey.split("."); 
    let translationValue = translations[language]; 

    keys.forEach((key) => {
        translationValue = translationValue?.[key];
    });

        if (translationValue) {
            element.textContent = translationValue;
        }
    });

  document.querySelector('#CV').href = translations[language]["cvLinks"];

}

// Llamar a la función al cargar la página
updateTranslations();

// Escuchar el evento de cambio de idioma
document.addEventListener("languageChange", (e) => {
    language = e.detail.language; // Actualizar el idioma

    updateTranslations(); // Actualizar textos traducidos en la página
});


//Cambio de paginas

const MainContent = document.getElementById("Content");
const AboutContent = document.getElementById("About-Content");
const ProjectContent = document.getElementById("Project-Content");
const ContactContent = document.getElementById("Contact-Content");


window.mainDisplay = function (event) {
  if (event) event.preventDefault(); // Verifica que event existe antes de llamarlo
  MainContent.style.display = "block";
  AboutContent.style.display = "none";
  ProjectContent.style.display = "none";
  ContactContent.style.display = "none";

  window.scrollTo({
    top: 0,
    behavior: "smooth", // Hace la animación suave
  });
};

window.aboutDisplay = function (event) {
  if (event) event.preventDefault(); // Verifica que event existe antes de llamarlo
  MainContent.style.display = "none";
  AboutContent.style.display = "block";
  ProjectContent.style.display = "none";
  ContactContent.style.display = "none";

  window.scrollTo({
    top: 0,
    behavior: "smooth", // Hace la animación suave
  });
};

window.projectsDisplay = function (event) {
  if (event) event.preventDefault(); // Verifica que event existe antes de llamarlo
  MainContent.style.display = "none";
  AboutContent.style.display = "none";
  ProjectContent.style.display = "block";
  ContactContent.style.display = "none";

  window.scrollTo({
    top: 0,
    behavior: "smooth", // Hace la animación suave
  });
};

window.contactDisplay = function (event) {
  if (event) event.preventDefault(); // Verifica que event existe antes de llamarlo
  MainContent.style.display = "none";
  AboutContent.style.display = "none";
  ProjectContent.style.display = "none";
  ContactContent.style.display = "block";

  window.scrollTo({
    top: 0,
    behavior: "smooth", // Hace la animación suave
  });
};
