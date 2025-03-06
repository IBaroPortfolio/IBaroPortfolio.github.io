import translations from "../translations.js"; 

class SkillList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        document.addEventListener("languageChange", () => this.render());
    }

    disconnectedCallback() {
        document.removeEventListener("languageChange", () => this.render());
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, translations[localStorage.getItem("language") || "en"]);
    }

    render() {
        const shadow = this.shadowRoot;
        shadow.innerHTML = "";

        // Contenedor principal
        const container = document.createElement("div");
        container.classList.add("skill-container");

        // Obtener claves de traducción
        const labelTranslationKey = this.getAttribute("data-translation");
        const textTranslationKey = this.getAttribute("data-translation-text");

        // Aplicar traducción si existen
        const translatedLabel = labelTranslationKey ? this.getTranslation(labelTranslationKey) : null;
        const translatedText = textTranslationKey ? this.getTranslation(textTranslationKey) : null;

        // Obtener label y text con su respectiva traducción
        let label = translatedLabel || this.getAttribute("label") || "Skill";
        let text = translatedText || this.getAttribute("text");

        // Crear la etiqueta (label)
        const labelElement = document.createElement("span");
        labelElement.classList.add("skill-label");
        labelElement.textContent = label;

        // Crear el contenedor de la visualización
        const displayContainer = document.createElement("div");
        displayContainer.classList.add("skill-display");

        if (text) {
            // Si hay texto, lo usa en lugar de los círculos
            const textElement = document.createElement("span");
            textElement.classList.add("skill-text");
            textElement.textContent = text;
            displayContainer.appendChild(textElement);
        } else {
            // Si no hay texto, crea los círculos basados en el nivel
            const level = parseInt(this.getAttribute("level")) || 0;

            for (let i = 1; i <= 5; i++) {
                const circle = document.createElement("div");
                circle.classList.add("circle");
                if (i <= level) {
                    circle.classList.add("filled");
                }
                displayContainer.appendChild(circle);
            }
        }

        // Adjuntar todo al Shadow DOM
        container.appendChild(labelElement);
        container.appendChild(displayContainer);
        shadow.appendChild(container);

        // Incluir el estilo dentro del Shadow DOM
        const style = document.createElement("style");
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
                background-color: rgba(235, 227, 248);
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

// Definir el custom element
customElements.define("skill-list", SkillList);

export default SkillList;
