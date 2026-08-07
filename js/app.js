import { CONFIG } from '../config.js';
import { initSearch } from './search.js';

class WeddingApp {
    constructor() {
        this.config = CONFIG;
        this.data = { tables: [], guests: [] };
    }

    async init() {
        if (this.checkExpiration()) return;

        this.applyConfig();
        await this.loadData();
        
        // Suchfunktion starten
        initSearch(this.data.guests, (guest) => this.onGuestSelected(guest));
    }

    checkExpiration() {
        const now = new Date();
        const expiryDate = new Date(this.config.expirationDate);
        
        if (now > expiryDate) {
            document.getElementById('app-content').classList.add('hidden');
            document.getElementById('expiry-screen').classList.remove('hidden');
            return true;
        }
        return false;
    }

    applyConfig() {
        document.getElementById('app-title').innerText = `${this.config.names.bride} & ${this.config.names.groom}`;
        document.getElementById('app-subtitle').innerText = this.config.subtitle;
    }

    async loadData() {
        try {
            // WICHTIG: Pfad geändert auf './data.json'
            const response = await fetch('./data.json');
            this.data = await response.json();
            this.renderMapMarkers();
        } catch (error) {
            console.error("Fehler beim Laden der data.json:", error);
        }
    }

    renderMapMarkers() {
        const layer = document.getElementById('tables-layer');
        layer.innerHTML = '';
        
        this.data.tables.forEach(table => {
            const marker = document.createElement('div');
            marker.style.position = 'absolute';
            marker.style.left = `${table.x}%`;
            marker.style.top = `${table.y}%`;
            marker.style.transform = 'translate(-50%, -50%)';
            marker.style.background = 'rgba(212, 175, 55, 0.8)';
            marker.style.border = '2px solid white';
            marker.style.borderRadius = '50%';
            marker.style.width = '30px';
            marker.style.height = '30px';
            marker.id = `marker-${table.id}`;
            marker.classList.add('table-marker-dot');
            
            layer.appendChild(marker);
        });
    }

    onGuestSelected(guest) {
        document.getElementById('map-section').classList.remove('hidden');
        
        const table = this.data.tables.find(t => t.id === guest.tableId);
        const tableName = table ? table.name : "Unbekannter Tisch";
        
        document.getElementById('target-guest-info').innerText = `${guest.name} – ${tableName}, Platz ${guest.seat}`;
        
        if (window.confetti) {
            window.confetti({ 
                particleCount: 80, 
                spread: 70, 
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#F4E8C1', '#FFFFFF']
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeddingApp();
    app.init();
});
