import translations from "../translations.js";

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.language = localStorage.getItem("language") || "en";

        this.render();
    }

    render() {
        this.shadow.innerHTML = "";

        // Crear el contenedor del header
        this.header = document.createElement('header');
        this.header.innerHTML = `
            <div class="logo">
                <img class="header-logo" src="./public/assets/Logo.svg" onclick="mainDisplay()">
            </div>
            
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul class="header-nav" id="navMenu">
                <p id="home-link" class="nav-link active" onclick="mainDisplay()">${translations[this.language].header.home}</p>
                <p id="about-link" class="nav-link" onclick="aboutDisplay()">${translations[this.language].header.about}</p>
                <p id="projects-link" class="nav-link" onclick="projectsDisplay()">${translations[this.language].header.projects}</p>
                <p id="contact-link" class="nav-link" onclick="contactDisplay()">${translations[this.language].header.contact}</p>
            </ul>

            <button class="language-switcher" id="languageSwitcher">${this.language === "en" ? "EN" : "ES"}</button>
        `;

        // Agregar estilos
        this.styleTag = document.createElement('style');
        this.styleTag.textContent = `
            header {
                font-family: 'Poppins';
                background-color: var(--Purple);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 5vw;
                margin: 1vh auto;
                height: 12vh;
                width: 80%;
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 100;
                box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 20px 0px;
                border-radius: 100px;
            }

            .logo {
                height: 6vh;
                align-items: center;
            }

            .header-logo:hover {
                cursor: pointer;
            }

            .logo img {
                height: 100%;
            }

            header ul {
                display: flex;
                gap: 2vw;
            }

            header ul p {
                transition: all 0.3s;
            }

            header ul p:hover {
                cursor: pointer;
                opacity: 0.7;
                scale: 1.1;
            }

            .nav-link {
                text-decoration: none; /* Asegura que no haya subrayado por defecto */
                color: inherit;
                transition: all 0.3s ease;
            }

            .nav-link.active {
                text-decoration: underline;
            }

            /* Estilos del botón de hamburguesa */
            .hamburger {
                display: none; 
                flex-direction: column;
                justify-content: space-between;
                width: 30px;
                height: 21px;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
            }

            .hamburger span {
                width: 100%;
                height: 3px;
                background-color: white;
                border-radius: 5px;
                transition: all 0.3s ease-in-out;
            }

            .hamburger.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }

            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }

            .hamburger.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }

            /* Mostrar el menú en pantallas pequeñas */
            @media screen and (max-width: 1024px) {

                header{
                    height: 8vh;
                    padding: 0 6vw;
                }

                .logo {
                    height: 4.5vh;
                }

                .hamburger {
                    display: flex;
                }

                .header-nav {
                    position: absolute;
                    top: 7vh;
                    left: 0;
                    width: 100%;
                    background: var(--Purple);
                    display: none;
                    flex-direction: column;
                    text-align: center;
                    padding: 1vh 0;
                }

                .header-nav.active {
                    display: flex;
                }

                .language-switcher {
                    margin-left: 0; /* Eliminar margen en móviles */
                    padding-left: 0;
                    margin-bottom: 2vh;
                }
            }

            .language-switcher {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                margin-left: 20px;
                transition: all 0.3s;
            }

            .language-switcher:hover {
                cursor: pointer;
                opacity: 0.7;
                scale: 1.1;
            }
        `;

        // Agregar elementos al Shadow DOM
        this.shadow.appendChild(this.styleTag);
        this.shadow.appendChild(this.header);

        // Agregar funcionalidad del menú hamburguesa
        this.addEventListeners();

        // Mover el botón de idioma según el tamaño de la pantalla
        this.moveLanguageSwitcher();
        window.addEventListener('resize', () => this.moveLanguageSwitcher());
    }

    moveLanguageSwitcher() {
        const languageSwitcher = this.shadow.getElementById('languageSwitcher');
        const navMenu = this.shadow.getElementById('navMenu');
        const header = this.shadow.querySelector('header');

        if (window.innerWidth <= 1024) {
            // Mover el botón dentro del ul en dispositivos móviles
            if (!navMenu.contains(languageSwitcher)) {
                navMenu.appendChild(languageSwitcher);
            }
        } else {
            // Devolver el botón a su posición original en pantallas grandes
            if (navMenu.contains(languageSwitcher)) {
                header.appendChild(languageSwitcher);
            }
        }
    }

    closeMenu() {
        const hamburger = this.shadow.getElementById('hamburger');
        const navMenu = this.shadow.getElementById('navMenu');
        const overlay = document.getElementById('overlay');

        if (hamburger && navMenu && overlay) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    addEventListeners() {
        const hamburger = this.shadow.getElementById('hamburger');
        const navMenu = this.shadow.getElementById('navMenu');
        const overlay = document.getElementById('overlay');
        const languageSwitcher = this.shadow.getElementById('languageSwitcher');

        const navLinks = this.shadow.querySelectorAll('.nav-link');
        const homeLink = this.shadow.getElementById('home-link');
        const logo = this.shadow.querySelector('.header-logo');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }

        if (languageSwitcher) {
            languageSwitcher.addEventListener("click", () => {
                // Cerrar el menú y ocultar el overlay
                this.closeMenu();

                // Cambiar el idioma
                const currentActive = this.shadow.querySelector(".nav-link.active");
                const activeId = currentActive ? currentActive.id : "home-link"; 
                
                this.language = this.language === "en" ? "es" : "en";
                localStorage.setItem("language", this.language);
        
                this.render(); // Recargar el header con el nuevo idioma
                
                // Restaurar el enlace activo
                const newNavLinks = this.shadow.querySelectorAll(".nav-link");
                newNavLinks.forEach(link => link.classList.remove("active"));
        
                const newActive = this.shadow.getElementById(activeId);
                if (newActive) {
                    newActive.classList.add("active");
                }
        
                // Emitir evento global para actualizar el resto de la página
                document.dispatchEvent(new CustomEvent("languageChange", {
                    detail: { language: this.language }
                }));                           
            });
        }

        if (logo && homeLink) {
            logo.addEventListener("click", () => {
                // Cerrar el menú y ocultar el overlay
                this.closeMenu();

                // Remover 'active' de todos los enlaces
                navLinks.forEach(nav => nav.classList.remove("active"));
                // Agregar 'active' solo a Home
                homeLink.classList.add("active");
            });
        }

        // Cerrar el menú y ocultar el overlay al hacer clic en cualquier enlace del menú
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                // Cerrar el menú y ocultar el overlay
                this.closeMenu();

                // Remover 'active' de todos los enlaces
                navLinks.forEach(nav => nav.classList.remove("active"));
                // Agregar 'active' al seleccionado
                link.classList.add("active");
            });
        });
    }
}

// Definir el nuevo componente
customElements.define('custom-header', HeaderComponent);

export default HeaderComponent;