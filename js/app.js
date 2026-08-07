import { CONFIG } from '../config.js';
import { SearchModule } from './search.js';
import { AdminModule } from './admin.js';
import { triggerConfetti } from './animation.js';
import { getRandomSpeech } from './speech.js';

class WeddingApp {
    constructor() {
        this.config = CONFIG;
        this.data = { tables: [], guests: [] };
    }

    async init() {
        this.applyConfig();
        await this.loadData();
        
        new SearchModule(this.data.guests, (guest) => this.onGuestSelected(guest));
        new AdminModule(this.data, (newData) => {
            this.data = newData;
            this.renderMapMarkers();
        });

        const resetBtn = document.getElementById('reset-map-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetMap());
        }
        
        const pdfBtn = document.getElementById('pdf-download-btn');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => window.print());
        }
    }

    applyConfig() {
        const titleEl = document.getElementById('app-title');
        const subEl = document.getElementById('app-subtitle');
        if (titleEl) titleEl.innerText = `${this.config.names.bride} & ${this.config.names.groom}`;
        if (subEl) subEl.innerText = this.config.subtitle;
    }

    async loadData() {
        try {
            const res = await fetch('data.json');
            if (!res.ok) throw new Error('Netzwerk-Antwort war nicht ok');
            this.data = await res.json();
            this.renderMapMarkers();
        } catch (e) {
            console.error("Fehler beim Laden der data.json:", e);
        }
    }

    renderMapMarkers() {
        const layer = document.getElementById('tables-layer');
        if (!layer) return;
        layer.innerHTML = '';
        
        if (!this.data.tables) return;

        this.data.tables.forEach(table => {
            const marker = document.createElement('div');
            marker.className = table.id === 't-braut' ? 'table-marker braut' : 'table-marker';
            marker.id = `marker-${table.id}`;
            marker.style.left = `${table.x}%`;
            marker.style.top = `${table.y}%`;

            const tableGuests = this.data.guests.filter(g => g.tableId === table.id);
            const guestNames = tableGuests.length > 0 
                ? tableGuests.map(g => g.name).join(', ') 
                : 'Frei';

            marker.innerHTML = `
                <div class="table-title">${table.name}</div>
                <div class="table-guests" title="${guestNames}">${guestNames}</div>
            `;

            layer.appendChild(marker);
        });
    }

    onGuestSelected(guest) {
        const mapSection = document.getElementById('map-section');
        if (mapSection) mapSection.classList.remove('hidden');
        
        const table = this.data.tables.find(t => t.id === guest.tableId);
        const infoEl = document.getElementById('target-guest-info');
        if (infoEl) {
            infoEl.innerText = `${guest.name} ➔ ${table ? table.name : 'Tisch'}, Sitzplatz ${guest.seat}`;
        }
        
        const speechBanner = document.getElementById('speech-banner');
        const speechText = document.getElementById('speech-text');
        if (speechBanner && speechText) {
            speechText.innerText = getRandomSpeech();
            speechBanner.classList.remove('hidden');
        }

        if (table) {
            document.querySelectorAll('.table-marker').forEach(m => m.classList.remove('highlight'));
            const targetMarker = document.getElementById(`marker-${table.id}`);
            
            if (targetMarker) {
                targetMarker.classList.add('highlight');
                
                setTimeout(() => {
                    targetMarker.classList.remove('highlight');
                }, 5000);

                const container = document.getElementById('map-container');
                if (container) {
                    const scale = 1.4;
                    const tx = (50 - table.x);
                    const ty = (50 - table.y);
                    container.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
                }
            }
        }

        triggerConfetti();
    }

    resetMap() {
        const container = document.getElementById('map-container');
        if (container) {
            container.style.transform = 'translate(0%, 0%) scale(1)';
        }
        document.querySelectorAll('.table-marker').forEach(m => m.classList.remove('highlight'));
        const infoEl = document.getElementById('target-guest-info');
        if (infoEl) infoEl.innerText = "Gesamter Saalplan";
        const speechBanner = document.getElementById('speech-banner');
        if (speechBanner) speechBanner.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeddingApp();
    app.init();
});
