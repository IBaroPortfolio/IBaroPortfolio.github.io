import './tag.js';

// Detectar el idioma actual
let currentLanguage = localStorage.getItem('language') || 'en';

const translations = {
    en: "View more on",
    es: "Ver más en"
  };  

fetch('./public/projects.json')
  .then(response => response.json())
  .then(data => {
    const carouselContainer = document.querySelector('.carousel-container');
    const projectCount = 6;

    carouselContainer.style.display = 'flex';
    carouselContainer.style.transition = 'transform 0.5s ease-in-out';
    carouselContainer.style.width = `${projectCount * 100}vw`;

    function renderProjects() {
      carouselContainer.innerHTML = ''; // Limpiar antes de volver a renderizar

      data.slice(0, 6).forEach(project => {
        const projectComponent = document.createElement('custom-project');
        projectComponent.setAttribute('name', project.name[currentLanguage]);
        projectComponent.setAttribute('description', project.description[currentLanguage]);
        projectComponent.setAttribute('src', project.src);
        projectComponent.setAttribute('tag1', project.tag1[currentLanguage]);
        projectComponent.setAttribute('tag2', project.tag2[currentLanguage]);
        projectComponent.setAttribute('link', project.link);
        projectComponent.setAttribute('icon', project.icon);

        projectComponent.style.minWidth = '100vw';
        projectComponent.style.boxSizing = 'border-box';

        carouselContainer.appendChild(projectComponent);
      });
    }

    renderProjects();

    document.addEventListener('languageChange', (event) => {
      currentLanguage = event.detail.language;
      renderProjects();
    });
  });

let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {
  const carousel = document.querySelector('.carousel-container');
  const totalProjects = carousel.children.length;

  currentIndex = (currentIndex < totalProjects - 1) ? currentIndex + 1 : 0;
  carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
});

document.querySelector('.prev').addEventListener('click', () => {
  const carousel = document.querySelector('.carousel-container');

  currentIndex = (currentIndex > 0) ? currentIndex - 1 : carousel.children.length - 1;
  carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
});


//Component

class Project extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'description', 'src', 'tag1', 'tag2', 'logo', 'link', 'icon'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Si quieres usar Shadow DOM
    }
  
    connectedCallback() {
        this.render(); 
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render(); // Re-renderiza al cambiar atributos
      }
    }
  
    render() {
      const lang =this.language;
      const name = this.getAttribute('name') || 'Project Name';
      const description = this.getAttribute('description') || 'Project Description';
      const src = this.getAttribute('src') || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
      const tag1 = this.getAttribute('tag1') || 'Tag';
      const tag2 = this.getAttribute('tag2') || 'Tag';
      const link = this.getAttribute('link') || '#';
      const icon = this.getAttribute('icon') || 'Project Icon';

      let iconsrc = '';
      if (icon === "Behance") {
        iconsrc = "./public/assets/Behance.svg"
      } else {
        iconsrc = './public/assets/WebIcon.png';
      }
  
      // Asegúrate de tener un espacio para el CSS también
      this.shadowRoot.innerHTML = `
        <style>
          .project {
            background-color: #211354;
            border-radius: 10px;
            padding: 4vh 8vh;
            margin: 0 21vw 0 10vw;
            text-align: right;
            height: 70vh;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
          }

          .project-image {
            width: 30vw;
            height: 30vw;
            margin-right: 3vw;
            object-fit: cover;
            object-position: center;
            border-radius: 20px;
          }
          .project-info {
            margin-top: 10px;
            font-family: "Poppins";
          }
          .project-title{
            font-family: 'GlorizVintage';
            font-size: 40px;
            font-weight: 400;
            line-height: 45px;
            margin: 0;
          }
          .project-tags {
            display: flex;
            justify-content: flex-end;
          }
          .project-link{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 1vw;
          }
          .project-logo{
            width: 2.5vw;
            margin-left: 1vw;
            transition: all 0.3s;
          }
          .project-logo:hover{
            scale: 1.1;
          }

            @media screen and (max-width: 1023px) {
              .project {
                padding: 3vh 3vh;
                margin: 0 15vw 0 5vw;
                text-align: left;
                height: 45vh;
                flex-direction: column;
                justify-content: space-around;     
                align-items: left;
              }
              .project-image {
                width: 100%;
                height: 40vw;
                margin-right: 0;
              }
              .project-info{
                width: 100%;
              }
              .project-title{
                font-size: 30px;
              }
              .project-tags {
                justify-content: flex-start;
              }
              .project-description{
                display: none
              }
              .project-link{
                justify-content: flex-start;
                 margin-top: 2vh;
              }
              .project-logo{
                width: 4vh;
                margin-left: 1vh
              }
            }
        </style>

        <div class="project">
            <img class="project-image" src="${src}" alt="${name}">
            <div class="project-info">
              <h3 class="project-title">${name}</h3>
              <div class="project-tags">
                <custom-tag type="pink" label=${tag1}></custom-tag>
                <custom-tag label=${tag2}></custom-tag>
              </div>
              <p class="project-description">${description}</p>
              <div class="project-link">
                <p id="viewMoreText">${translations[currentLanguage]}</p>
                <a href="${link}" target="_blank">
                  <img class="project-logo" src=${iconsrc} alt="Link">
                </a>
              </div>
            </div>
        </div>
      `;
    }
  }
  
  // Registrar el componente
  customElements.define('custom-project', Project);
  
  export default Project;