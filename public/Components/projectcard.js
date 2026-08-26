import './tag.js';

// Detectar el idioma actual
let currentLanguage = localStorage.getItem('language') || 'en';

// Guardamos referencia a los datos y al último filtro aplicado
// para poder re-renderizar cuando cambia el tamaño de la ventana
let allData = [];
let currentFilteredData = [];
let currentNumColumns = 3;

fetch('./public/projects.json')
  .then(response => response.json())
  .then(data => {
    allData = data;
    currentFilteredData = data;

    const projectCardsContainer = document.querySelector('.project-cards-container');
    const checkboxes = document.querySelectorAll('.cinput');
    const allCheckbox = document.querySelector("#cb1");

    // Preparamos el contenedor como flex-row: va a alojar N divs de columna
    projectCardsContainer.style.display = 'flex';
    projectCardsContainer.style.alignItems = 'flex-start';
    projectCardsContainer.style.transition = 'transform 0.5s ease-in-out';

    // Reparte los items en N columnas de forma balanceada
    // Ej: 10 items / 3 columnas -> [4,3,3] | 8 items / 3 -> [3,3,2] | 2 items / 3 -> [1,1,0]
    function distributeIntoColumns(data, numColumns) {
      const base = Math.floor(data.length / numColumns);
      const remainder = data.length % numColumns;
      const columns = [];
      let index = 0;

      for (let i = 0; i < numColumns; i++) {
        const size = base + (i < remainder ? 1 : 0);
        columns.push(data.slice(index, index + size));
        index += size;
      }

      return columns;
    }

    // Determina cuántas columnas según el ancho de pantalla
    function getNumColumns() {
      if (window.innerWidth <= 767) return 1;
      if (window.innerWidth >= 768 && window.innerWidth <= 1023) return 2;
      return 3;
    }

    // Aplica los estilos de espaciado/márgenes del contenedor según breakpoint
    function updateContainerStyles(numColumns) {
      if (numColumns === 1) {
        projectCardsContainer.style.margin = '0 auto';
        projectCardsContainer.style.gap = '0';
      } else if (numColumns === 2) {
        projectCardsContainer.style.margin = '0 auto';
        projectCardsContainer.style.gap = '3vh';
      } else {
        projectCardsContainer.style.margin = '';
        projectCardsContainer.style.gap = '3vw';
      }
    }

    function renderProjects(filteredData = currentFilteredData) {
      currentFilteredData = filteredData; // guardamos para re-render en resize
      currentNumColumns = getNumColumns();

      projectCardsContainer.innerHTML = ''; // Limpiar antes de volver a renderizar
      updateContainerStyles(currentNumColumns);

      const columns = distributeIntoColumns(filteredData, currentNumColumns);

      columns.forEach(columnData => {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('project-column');
        columnDiv.style.display = 'flex';
        columnDiv.style.flexDirection = 'column';
        columnDiv.style.flex = '1 1 0';
        columnDiv.style.minWidth = '0';

        columnData.forEach(project => {
          const projectComponent = document.createElement('project-cards');
          projectComponent.setAttribute('name', project.name[currentLanguage]);
          projectComponent.setAttribute('description', project.description[currentLanguage]);
          projectComponent.setAttribute('src', project.src);
          projectComponent.setAttribute('tag1', project.tag1[currentLanguage]);
          projectComponent.setAttribute('tag2', project.tag2[currentLanguage]);
          projectComponent.setAttribute('link', project.link);
          projectComponent.setAttribute('icon', project.icon);

          columnDiv.appendChild(projectComponent);
        });

        projectCardsContainer.appendChild(columnDiv);
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
        renderProjects(allData); // Mostrar todos los proyectos si no hay filtros o si "All" está seleccionado
        return;
      }

      const filteredData = allData.filter(project =>
        project.checkValue.some(tag => selectedFilters.includes(tag))
      );

      renderProjects(filteredData);
    }

    // Re-renderizar en resize SOLO si cambia la cantidad de columnas
    // (evita recalcular en cada pixel de resize)
    window.addEventListener('resize', () => {
      const newNumColumns = getNumColumns();
      if (newNumColumns !== currentNumColumns) {
        renderProjects(currentFilteredData);
      }
    });

    // Renderizar los proyectos inicialmente
    renderProjects(data);
    updateCheckboxes(); // Asegurar que "All" se active si nada más está seleccionado

    document.addEventListener('languageChange', (event) => {
      currentLanguage = event.detail.language;
      renderProjects(currentFilteredData);
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
                <custom-tag type="purple" label=${tag2}></custom-tag>
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
