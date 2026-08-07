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

        document.getElementById('reset-map-btn').addEventListener('click', () => this.resetMap());
        document.getElementById('pdf-download-btn').addEventListener('click', () => {
            window.print();
        });
    }

    applyConfig() {
        document.getElementById('app-title').innerText = `${this.config.names.bride} & ${this.config.names.groom}`;
        document.getElementById('app-subtitle').innerText = this.config.subtitle;
    }

    async loadData() {
        try {
            const res = await fetch('./data.json');
            this.data = await res.json();
            this.renderMapMarkers();
        } catch (e) {
            console.error("Fehler beim Laden der data.json", e);
        }
    }

    renderMapMarkers() {
        const layer = document.getElementById('tables-layer');
        layer.innerHTML = '';
        
        this.data.tables.forEach(table => {
            const marker = document.createElement('div');
            marker.className = table.id === 't-braut' ? 'table-marker braut' : 'table-marker';
            marker.id = `marker-${table.id}`;
            marker.style.left = `${table.x}%`;
            marker.style.top = `${table.y}%`;

            // Finde alle Gäste an diesem Tisch
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
        document.getElementById('map-section').classList.remove('hidden');
        
        const table = this.data.tables.find(t => t.id === guest.tableId);
        document.getElementById('target-guest-info').innerText = `${guest.name} ➔ ${table ? table.name : 'Tisch'}, Sitzplatz ${guest.seat}`;
        
        const speechBanner = document.getElementById('speech-banner');
        document.getElementById('speech-text').innerText = getRandomSpeech();
        speechBanner.classList.remove('hidden');

        if (table) {
            document.querySelectorAll('.table-marker').forEach(m => m.classList.remove('highlight'));
            const targetMarker = document.getElementById(`marker-${table.id}`);
            
            if (targetMarker) {
                targetMarker.classList.add('highlight');
                
                setTimeout(() => {
                    targetMarker.classList.remove('highlight');
                }, 5000);

                const container = document.getElementById('map-container');
                const scale = 1.6;
                const tx = -(table.x * scale) + 50;
                const ty = -(table.y * scale) + 50;
                container.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
            }
        }

        triggerConfetti();
    }

    resetMap() {
        const container = document.getElementById('map-container');
        container.style.transform = 'translate(0%, 0%) scale(1)';
        document.querySelectorAll('.table-marker').forEach(m => m.classList.remove('highlight'));
        document.getElementById('target-guest-info').innerText = "Gesamter Saalplan";
        document.getElementById('speech-banner').classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeddingApp();
    app.init();
});
