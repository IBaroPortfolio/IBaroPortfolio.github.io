//Menu navegacion
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
});

//Componentes

class TagComponent extends HTMLElement {
    constructor() {
      super();  // Llamar al constructor del HTMLElement
      
      // Crear un contenedor (shadow DOM) para encapsular el componente
      this.shadow = this.attachShadow({ mode: 'open' });
      
      // Crear un div para la etiqueta
      this.tag = document.createElement('div');
      this.tag.classList.add('tag');
      
      // Estilos internos (puedes añadirlos directamente aquí si no los quieres externos)
      this.styleTag = document.createElement('style');
      this.shadow.appendChild(this.styleTag);
      this.shadow.appendChild(this.tag);
      
      // Llamar al método que actualizará el contenido
      this.updateTag();
    }
    
    static get observedAttributes() {
      return ['label', 'type'];  // Observar cambios en estos atributos
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.updateTag();  // Actualizar la etiqueta si el atributo cambia
      }
    }
  
    updateTag() {
      // Obtener el texto del atributo 'label' del componente
      const label = this.getAttribute('label');
      this.tag.textContent = label;
  
      // Obtener el tipo y aplicar el color correspondiente
      const type = this.getAttribute('type');
      let color;
      type === "pink" ? color = "var(--Pink)" : color = "var(--LightPurple)";
      
      // Aplicar los estilos actualizados
      this.styleTag.textContent = `
        .tag {
          font-family: 'Poppins';
          background-color: ${color};
          color: white;
          border-radius: 100px;
          display: flex;
          height: 3vh;
          padding: 1vh 2vw;
          justify-content: center;
          text-align: center;
          align-items: center;
          font-size: 14px;
          font-weight: 400;
          margin-left: 1vw;
        }
          @media screen and (max-width: 1023px) {
            .tag {padding: 1vh 2vh;}
          }
      `;
    }
  }
  
  customElements.define('custom-tag', TagComponent);
  

  class SkillList extends HTMLElement {
    constructor() {
      super();
  
      // Crear el Shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Crear contenedor para la etiqueta y los círculos o texto alternativo
      const container = document.createElement('div');
      container.classList.add('skill-container');
  
      // Crear el texto (etiqueta)
      const label = document.createElement('span');
      label.classList.add('skill-label');
      label.textContent = this.getAttribute('label') || 'Skill';
  
      // Crear el contenedor de los círculos o el texto alternativo
      const displayContainer = document.createElement('div');
      displayContainer.classList.add('skill-display');
  
      // Verificar si tiene un atributo "text"
      const text = this.getAttribute('text');
      if (text) {
        // Mostrar el texto alternativo (como "Native" o "C1")
        const textElement = document.createElement('span');
        textElement.classList.add('skill-text');
        textElement.textContent = text;
        displayContainer.appendChild(textElement);
      } else {
        // Si no tiene "text", mostrar los círculos basados en el nivel
        const level = parseInt(this.getAttribute('level')) || 0;
  
        // Crear 5 círculos
        for (let i = 1; i <= 5; i++) {
          const circle = document.createElement('div');
          circle.classList.add('circle');
          if (i <= level) {
            circle.classList.add('filled');
          }
          displayContainer.appendChild(circle);
        }
      }
  
      // Adjuntar todo al shadow DOM
      container.appendChild(label);
      container.appendChild(displayContainer);
      shadow.appendChild(container);
  
      // Incluir el estilo dentro del Shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        .skill-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 1vh;
        }
        .skill-label {
          font-family: 'Poppins';
          font-size: 18px;
          font-weight: bold;
          color: white;
        }
        .skill-display {
          display: flex;
          gap: 5px;
        }
        .circle {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: rgba(235, 227, 248);;
        }
        .circle.filled {
          background-color: var(--LightPurple);
        }
        .skill-text {
          font-family: 'Poppins';
          font-size: 16px;
          font-weight: regular;
          color: #ffffff;
        }
      `;
      shadow.appendChild(style);
    }
  }
  
  customElements.define('skill-list', SkillList);
  
  

  class Project extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'description', 'src', 'tag1', 'tag2', 'logo', 'link', 'icon'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Si quieres usar Shadow DOM
    }
  
    connectedCallback() {
      this.render(); // Renderiza al conectar el componente
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
            background-color: var(--Purple);
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
            margin-right: 5vw;
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
                <p>View more on</p>
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
  
  
  
  fetch('./public/projects.json')
  .then(response => response.json())
  .then(data => {
    const carouselContainer = document.querySelector('.carousel-container');
    const projectCount = data.length;
    
    // Ajustar el estilo del contenedor del carrusel para hacerlo horizontal
    carouselContainer.style.display = 'flex';
    carouselContainer.style.transition = 'transform 0.5s ease-in-out';
    carouselContainer.style.width = `${projectCount * 100}vw`; // Asegurarse que el contenedor es lo suficientemente ancho para todos los proyectos

    data.forEach(project => {
      const projectComponent = document.createElement('custom-project');
      projectComponent.setAttribute('name', project.name);
      projectComponent.setAttribute('description', project.description);
      projectComponent.setAttribute('src', project.src);
      projectComponent.setAttribute('tag1', project.tag1);
      projectComponent.setAttribute('tag2', project.tag2);
      projectComponent.setAttribute('link', project.link);
      projectComponent.setAttribute('icon', project.icon);

      // Definir el tamaño de cada proyecto como un "slide" en el carrusel
      projectComponent.style.minWidth = '100vw'; // Cada proyecto ocupará toda la vista
      projectComponent.style.boxSizing = 'border-box';

      carouselContainer.appendChild(projectComponent);
    });
  });

let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {
  const carousel = document.querySelector('.carousel-container');
  const totalProjects = carousel.children.length;

  if (currentIndex < totalProjects - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Reiniciar si es el último
  }

  carousel.style.transform = `translateX(-${currentIndex * 100}vw)`; // Mover el carrusel
});

document.querySelector('.prev').addEventListener('click', () => {
  const carousel = document.querySelector('.carousel-container');

  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = carousel.children.length - 1; // Volver al último
  }

  carousel.style.transform = `translateX(-${currentIndex * 100}vw)`; // Mover el carrusel
});
