// Flexible Modal template and data loading system
class FlexibleModalManager {
    constructor() {
        this.modals = new Map();
        this.sectionRenderers = new Map();
        this.initializeSectionRenderers();
    }

    // Initialize different section renderers
    initializeSectionRenderers() {
        // Text-only renderer
        this.sectionRenderers.set('text', (content) => `
            <div class="text-content">
                <p>${content}</p>
            </div>
        `);

        // Image + text renderer (original format)
        this.sectionRenderers.set('image-text', (items) => `
            ${items.map(item => `
                <div class="image-text-item">
                    <img src="${item.image}" alt="${item.alt}">
                    <div>
                        <p><strong>${item.title}</strong><br>
                        ${item.description}</p>
                    </div>
                </div>
            `).join('')}
        `);

        // List renderer
        this.sectionRenderers.set('list', (items) => `
            <ul>
                ${items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `);

        // Ordered list renderer
        this.sectionRenderers.set('ordered-list', (items) => `
            <ol>
                ${items.map(item => `
                    <li>
                        <strong>${item.title}</strong><br>
                        ${item.description}
                    </li>
                `).join('')}
            </ol>
        `);

        // Table renderer
        this.sectionRenderers.set('table', (data) => `
            <table class="modal-table">
                <thead>
                    <tr>
                        ${data.headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.rows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `);

        // Nested recommendations renderer
        this.sectionRenderers.set('recommendations', (items) => `
            <ol>
                ${items.map(rec => `
                    <li>
                        <strong>${rec.title}</strong>
                        <ul>
                            ${rec.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ol>
        `);

        // Gallery renderer
        this.sectionRenderers.set('gallery', (images) => `
            <div class="image-gallery">
                ${images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.alt}">
                        ${img.caption ? `<p class="caption">${img.caption}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `);

        // Cards renderer
        this.sectionRenderers.set('cards', (cards) => `
            <div class="cards-container">
                ${cards.map(card => `
                    <div class="card">
                        ${card.image ? `<img src="${card.image}" alt="${card.alt}">` : ''}
                        <div class="card-content">
                            <h5>${card.title}</h5>
                            <p>${card.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);
    }

    // Load modal data from JSON file
    async loadModalData(modalId, jsonPath) {
        try {
            const response = await fetch(jsonPath);
            const data = await response.json();
            this.modals.set(modalId, data);
            return data;
        } catch (error) {
            console.error(`Error loading modal data for ${modalId}:`, error);
            return null;
        }
    }

    // Render a section based on its type
    renderSection(section) {
        const renderer = this.sectionRenderers.get(section.type);
        if (!renderer) {
            console.warn(`Unknown section type: ${section.type}`);
            return `<p>Unknown section type: ${section.type}</p>`;
        }
        return renderer(section.content);
    }

    // Generate modal HTML from flexible template
    generateModalHTML(modalId, data) {
        // Basic info section
        const basicInfo = `
            <div class="description-box">
                ${data.skills ? `
                    <div class="desc-row">
                        <div class="desc-col" id="desc-col1"><p>skills</p></div>
                        <div class="desc-col" id="desc-col2">
                            ${data.skills.map(skill => `<span class="span-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${data.links ? `
                    <div class="desc-row">
                        <div class="desc-col" id="desc-col1"><p>link</p></div>
                        <div class="desc-col" id="desc-col2">
                            ${data.links.map(link => `
                                <a href="${link.url}">
                                    <p>• ${link.title}</p>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${data.year ? `
                    <div class="desc-row">
                        <div class="desc-col" id="desc-col1"><p>year</p></div>
                        <div class="desc-col" id="desc-col2"><p>${data.year}</p></div>
                    </div>
                ` : ''}
            </div>
        `;

        // Dynamic sections
        const dynamicSections = data.sections ? data.sections.map(section => `
            <h4>${section.title}</h4>
            <div class="${section.title.toLowerCase().replace(/\s+/g, '-')}-container">
                ${this.renderSection(section)}
            </div>
        `).join('') : '';

        return `
            <div class="modal-overlay" id="modal-${modalId}">
                <div class="modal-box">
                    <div class="modal-header">
                        <h2>${data.title}</h2>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-content">
                        ${data.summaryImage ? `<img src="${data.summaryImage}" alt="${data.title} Dashboard" class="modal-image">` : ''}
                        ${basicInfo}
                        <div class="desc-body">
                            ${dynamicSections}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create and inject modal into DOM
    async createModal(modalId, jsonPath) {
        const data = await this.loadModalData(modalId, jsonPath);
        if (!data) return false;

        const modalHTML = this.generateModalHTML(modalId, data);
        
        // Inject modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        this.addModalEventListeners(modalId);
        
        return true;
    }

    // Add event listeners for modal functionality
    addModalEventListeners(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        const closeBtn = modal.querySelector('.close-btn');
        
        // Close modal when clicking close button
        closeBtn.addEventListener('click', () => {
            this.closeModal(modalId);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });
    }

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Initialize multiple modals
    async initializeModals(modalConfigs) {
        const promises = modalConfigs.map(config => 
            this.createModal(config.id, config.jsonPath)
        );
        
        await Promise.all(promises);
        console.log('All modals initialized');
    }
}

// Initialize flexible modal manager
const flexibleModalManager = new FlexibleModalManager();

// Example usage - call this when your page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Define your modal configurations
    const modalConfigs = [
        { id: 'porto1', jsonPath: 'assets/porto1/data.json' },
        { id: 'porto2', jsonPath: 'assets/porto2/data.json' },
        { id: 'porto3', jsonPath: 'assets/porto3/data.json' },
        { id: 'porto4', jsonPath: 'assets/porto4/data.json' },
        { id: 'porto5', jsonPath: 'assets/porto5/data.json' },        
    ];
    
    // Initialize all modals
    await flexibleModalManager.initializeModals(modalConfigs);
});

// Function to open modal - call this from your buttons
function openModal(modalId) {
    flexibleModalManager.openModal(modalId);
}