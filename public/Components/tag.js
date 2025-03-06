class TagComponent extends HTMLElement {
    constructor() {
      super();  
      this.shadow = this.attachShadow({ mode: 'open' });

      this.tag = document.createElement('div');
      this.tag.classList.add('tag');

      this.styleTag = document.createElement('style');
      this.shadow.appendChild(this.styleTag);
      this.shadow.appendChild(this.tag);

      this.updateTag();
    }
    
    static get observedAttributes() {
      return ['label', 'type'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.updateTag();
      }
    }
  
    updateTag() {
      const label = this.getAttribute('label');
      this.tag.textContent = label;

      const type = this.getAttribute('type');
      let color = type === "pink" ? "var(--Pink)" : "var(--LightPurple)";
      
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

// Registrar el componente
customElements.define('custom-tag', TagComponent);

// Exportar la clase para poder importarla en otros archivos
export default TagComponent;
