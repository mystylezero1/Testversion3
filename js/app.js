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
            marker.style.left = `${table.x}%`;
            marker.style.top = `${table.y}%`;
            marker.id = `marker-${table.id}`;
            marker.classList.add('css-table'); // Nutzt jetzt unser elegantes CSS-Design
            marker.innerText = table.name; // Schreibt den Namen (z.B. "Tisch 3") in die Box
            
            layer.appendChild(marker);
        });
    }

    onGuestSelected(guest) {
        document.getElementById('map-section').classList.remove('hidden');
        
        const table = this.data.tables.find(t => t.id === guest.tableId);
        const tableName = table ? table.name : "Unbekannter Tisch";
        document.getElementById('target-guest-info').innerText = `${guest.name} – ${tableName}, Platz ${guest.seat}`;
        
        if (table) {
            document.querySelectorAll('.css-table').forEach(m => m.classList.remove('highlight'));
            
            const targetMarker = document.getElementById(`marker-${table.id}`);
            if (targetMarker) {
                targetMarker.classList.add('highlight');
            }

            const container = document.getElementById('map-container');
            const scale = 2.0; 
            
            const translateX = -(table.x * scale) + 50; 
            const translateY = -(table.y * scale) + 50;
            
            container.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
        }

        if (window.confetti) {
            window.confetti({ 
                particleCount: 100, spread: 70, origin: { y: 0.6 },
                colors: ['#D4AF37', '#F4E8C1', '#FFFFFF']
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeddingApp();
    app.init();
});
