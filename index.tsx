import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { tailwindStyles } from './styles/tailwind-styles';

class SlaCommandCenterElement extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Inject bundled styles
    const style = document.createElement('style');
    style.textContent = tailwindStyles;
    shadowRoot.appendChild(style);

    // Create mount point for React app
    const mountPoint = document.createElement('div');
    mountPoint.style.height = "100vh";
    shadowRoot.appendChild(mountPoint);

    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

customElements.define('sla-command-center', SlaCommandCenterElement);