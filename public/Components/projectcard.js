import './tag.js';

// Detectar el idioma actual
let currentLanguage = localStorage.getItem('language') || 'en';

fetch('./public/projects.json')
  .then(response => response.json())
  .then(data => {
    const projectCardsContainer = document.querySelector('.project-cards-container');
    const checkboxes = document.querySelectorAll('.cinput');
    const allCheckbox = document.querySelector("#cb1");

    // Estilos de la grilla de proyectos
    function updateColumnCount() {
      if (window.innerWidth <= 767) {
          projectCardsContainer.style.columnCount = '1';
          projectCardsContainer.style.margin = '0 auto'; 
      } else if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
        projectCardsContainer.style.columnCount = '2';
        projectCardsContainer.style.margin = '0 auto'; 
        projectCardsContainer.style.columnGap = '3vh'; 
      } else {
          projectCardsContainer.style.columnCount = '3';
          projectCardsContainer.style.columnGap = '3vw'; 
      }
    }
  
    // Ejecutar la función al cargar la página
    updateColumnCount();
  
    // Ejecutar la función cada vez que se redimensiona la ventana
    window.addEventListener('resize', updateColumnCount);
    projectCardsContainer.style.transition = 'transform 0.5s ease-in-out';

    function renderProjects(filteredData = data) {
      projectCardsContainer.innerHTML = ''; // Limpiar antes de volver a renderizar

      filteredData.forEach(project => {
        const projectComponent = document.createElement('project-cards');
        projectComponent.setAttribute('name', project.name[currentLanguage]);
        projectComponent.setAttribute('description', project.description[currentLanguage]);
        projectComponent.setAttribute('src', project.src);
        projectComponent.setAttribute('tag1', project.tag1[currentLanguage]);
        projectComponent.setAttribute('tag2', project.tag2[currentLanguage]);
        projectComponent.setAttribute('link', project.link);
        projectComponent.setAttribute('icon', project.icon);

        projectCardsContainer.appendChild(projectComponent);
      });
    }

    function updateCheckboxes() {
      let selectedFilters = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked && checkbox !== allCheckbox)
        .map(checkbox => checkbox.value);

      // Si ningún checkbox está seleccionado, activar "All"
      if (selectedFilters.length === 0) {
        allCheckbox.checked = true;
      } 
      // Si todos menos "All" están seleccionados, activar solo "All"
      else if (selectedFilters.length === checkboxes.length - 1) {
        checkboxes.forEach(checkbox => {
          if (checkbox !== allCheckbox) checkbox.checked = false;
        });
        allCheckbox.checked = true;
      } 
      // Si "All" está seleccionado y se elige otro, deseleccionar "All"
      else {
        allCheckbox.checked = false;
      }

      filterProjects();
    }

    function filterProjects() {
      let selectedFilters = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
        .map(checkbox => checkbox.value);

      if (selectedFilters.length === 0 || selectedFilters.includes('all')) {
        renderProjects(data); // Mostrar todos los proyectos si no hay filtros o si "All" está seleccionado
        return;
      }

      const filteredData = data.filter(project =>
        project.checkValue.some(tag => selectedFilters.includes(tag))
      );

      renderProjects(filteredData);
    }

    // Renderizar los proyectos inicialmente
    renderProjects();
    updateCheckboxes(); // Asegurar que "All" se active si nada más está seleccionado

    document.addEventListener('languageChange', (event) => {
      currentLanguage = event.detail.language;
      renderProjects();
    });

    // Aplicar evento de cambio a los checkboxes
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        if (this === allCheckbox) {
          // Si se marca "All", deselecciona los demás checkboxes
          if (this.checked) {
            checkboxes.forEach(cb => {
              if (cb !== allCheckbox) cb.checked = false;
            });
          }
        } else {
          // Si se seleccionan todos los demás, marca "All" y desmarca los demás
          let allSelected = Array.from(checkboxes)
            .filter(cb => cb !== allCheckbox)
            .every(cb => cb.checked);
    
          if (allSelected) {
            allCheckbox.checked = true;
            checkboxes.forEach(cb => {
              if (cb !== allCheckbox) cb.checked = false;
            });
          } else {
            allCheckbox.checked = false;
          }
    
          // Si no hay ningún checkbox seleccionado, activar "All" automáticamente
          let anySelected = Array.from(checkboxes).some(cb => cb.checked);
          if (!anySelected) {
            allCheckbox.checked = true;
          }
        }
    
        filterProjects();
      });
    });
    
  });


//Component

class ProjectCard extends HTMLElement {
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
            margin-bottom: 3vw;
            break-inside: avoid;
            background-color: var(--Purple);
            border-radius: 10px;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            position: relative;
            transition: all 800ms ease;
          }

            .project:hover {
              scale: 1.03;
              cursor: pointer;
            }

          .project:hover::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1;
            transition: all 800ms ease;
          }

          .project-image {
            width: 100%;
            margin: 0;
            object-fit: cover;
            object-position: center;
            border-radius: 10px 10px 0 0;
          }

          /* Nueva capa para el logo */
          .overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 800ms ease;
            z-index: 2;
          }
            .project:hover .overlay {
            opacity: 1;
          }

          .overlay img {
            width: 5vw;
            transition: transform 800ms ease;
          }

          .project-info {
            margin-top: 10px;
            font-family: "Poppins";
            padding: 3vh 4vh;
          }
          .project-title{
            font-family: 'GlorizVintage';
            font-size: 30px;
            font-weight: 400;
            line-height: 45px;
            margin: 0;
          }
          .project-tags {
            display: flex;
            margin-left: -1vw;
          }
          .project-description{
            font-size: 14px;
          }

            @media screen and (max-width: 1023px) {
              .project {
                margin: 0 0 5vh 0;
                text-align: left;
                flex-direction: column;
                justify-content: space-around;     
                align-items: left;
              }
              .project-image {
                width: 100%;
                margin-right: 0;
              }
              .project-info{
                width: 100%;
              }
              .project-title{
                font-size: 30px;
                padding: 0 3vh;
              }
              .project-tags {
                justify-content: flex-start;
                padding: 0 3vh;
              }
              .project-description{
                padding: 0 3vh;
              }
            }
        </style>

        <div class="project">
            <img class="project-image" src="${src}" alt="${name}">
            <div class="overlay">
              <a href="${link}" target="_blank">
                <img src=${iconsrc} alt="Project Icon">
              </a>
            </div>
            <div class="project-info">
              <h3 class="project-title">${name}</h3>
              <div class="project-tags">
                <custom-tag type="pink" label=${tag1}></custom-tag>
                <custom-tag label=${tag2}></custom-tag>
              </div>
              <p class="project-description">${description}</p>
            </div>
        </div>
      `;
    }
  }
  
  // Registrar el componente
  customElements.define('project-cards', ProjectCard);
  
  export default ProjectCard;