// Modal template and data loading system
class ModalManager {
    constructor() {
        this.modals = new Map();
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

    // Generate modal HTML from template
    generateModalHTML(modalId, data) {
        return `
            <div class="modal-overlay" id="modal-${modalId}">
                <div class="modal-box">
                    <div class="modal-header">
                        <h2>${data.title}</h2>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-content">
                        <img src="${data.summaryImage}" alt="${data.title} Dashboard" class="modal-image">
                        <div class="description-box">
                            <div class="desc-row">
                                <div class="desc-col" id="desc-col1"><p>skills</p></div>
                                <div class="desc-col" id="desc-col2">
                                    ${data.skills.map(skill => `<span class="span-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
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
                            <div class="desc-row">
                                <div class="desc-col" id="desc-col1"><p>year</p></div>
                                <div class="desc-col" id="desc-col2"><p>${data.year}</p></div>
                            </div>
                        </div>
                        <div class="desc-body">
                            <h4>Project Overview</h4>
                            <div class="overview-container">
                                <p>${data.overview}</p>
                            </div>
                            <h4>Methodology</h4>
                            <div class="methodology-container">
                                <ol>
                                    ${data.methodology.map(item => `
                                        <li><strong>${item.title}</strong><br>
                                        ${item.description}</li>
                                    `).join('')}
                                </ol>
                            </div>
                            <h4>Insight</h4>
                            <div class="insight-container">
                                ${data.insights.map(insight => `
                                    <img src="${insight.image}" alt="${insight.alt}">
                                    <div>
                                        <p><strong>${insight.title}</strong><br>
                                        ${insight.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <h4>Recommendation</h4>
                            <div class="recommendation-container">
                                <ol>
                                    ${data.recommendations.map(rec => `
                                        <li>
                                            <strong>${rec.title}</strong>
                                            <ul>
                                                ${rec.points.map(point => `<li>${point}</li>`).join('')}
                                            </ul>
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                            <h4>Features</h4>
                            <div class="feature-container">
                                ${data.features.map(feature => `
                                    <img src="${feature.image}" alt="${feature.alt}">
                                    <div>
                                        <p><strong>${feature.title}</strong><br>
                                        ${feature.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <h4>Notes</h4>
                            <div class="notes">
                                <p>${data.notes}</p>
                            </div>
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

// Initialize modal manager
const modalManager = new ModalManager();

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
    await modalManager.initializeModals(modalConfigs);
});

// Function to open modal - call this from your buttons
function openModal(modalId) {
    modalManager.openModal(modalId);
}