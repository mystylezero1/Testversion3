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
            marker.classList.add('table-marker-dot');
            
            layer.appendChild(marker);
        });
    }

    onGuestSelected(guest) {
        // 1. Map anzeigen
        document.getElementById('map-section').classList.remove('hidden');
        
        // 2. Tischinformationen auslesen
        const table = this.data.tables.find(t => t.id === guest.tableId);
        const tableName = table ? table.name : "Unbekannter Tisch";
        document.getElementById('target-guest-info').innerText = `${guest.name} – ${tableName}, Platz ${guest.seat}`;
        
        if (table) {
            // 3. Alle alten Highlights entfernen
            document.querySelectorAll('.table-marker-dot').forEach(m => m.classList.remove('highlight'));
            
            // 4. Neuen Highlight-Marker setzen
            const targetMarker = document.getElementById(`marker-${table.id}`);
            if (targetMarker) {
                targetMarker.classList.add('highlight');
            }

            // 5. Sanfter Zoom und Zentrierung auf den Tisch
            const container = document.getElementById('map-container');
            const scale = 2.2; 
            
            const translateX = -(table.x * scale) + 50; 
            const translateY = -(table.y * scale) + 50;
            
            container.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
        }

        // 6. Konfetti!
        if (window.confetti) {
            window.confetti({ 
                particleCount: 100, 
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
