import translations from "../translations.js";

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.language = localStorage.getItem("language") || "en";

        this.render();

        // Escuchar el evento de cambio de idioma
        document.addEventListener("languageChange", (event) => {
            this.language = event.detail.language; 
            this.render(); // Volver a renderizar el footer
        });
    }

    render() {
        this.shadow.innerHTML = "";

        // Crear el contenedor del footer
        this.footer = document.createElement('footer');
        this.footer.innerHTML = `
            <img class="logo" src="./public/assets/Logo.svg">
            <div>
                <p>${translations[this.language].footer.develop}</p>
                <p>${translations[this.language].footer.github}</p>
            </div>
        `;

        // Agregar estilos
        this.styleTag = document.createElement('style');
        this.styleTag.textContent = `
            footer {
                background-color: var(--Purple);
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align: right;
                padding: 0 5vw;
                margin-top: 5vh;
                height: 12vh;
                z-index: 99;
            }

            footer p {
                font-size: 10px;
            }

            .logo {
                height: 6vh;
                align-items: center;
            }
        `;

        // Agregar elementos al Shadow DOM
        this.shadow.appendChild(this.styleTag);
        this.shadow.appendChild(this.footer);
    }
}

// Definir el nuevo componente
customElements.define('custom-footer', FooterComponent);

export default FooterComponent;
