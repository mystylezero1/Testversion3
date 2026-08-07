import { CONFIG } from '../config.js';
import { SearchModule } from './search.js';
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
        this.initAdmin();

        document.getElementById('reset-map-btn').addEventListener('click', () => this.resetMap());
        document.getElementById('pdf-download-btn').addEventListener('click', () => window.print());
    }

    applyConfig() {
        document.getElementById('app-title').innerText = `${this.config.names.bride} & ${this.config.names.groom}`;
        document.getElementById('app-subtitle').innerText = this.config.subtitle;
    }

    async loadData() {
        try {
            const res = await fetch('data.json');
            this.data = await res.json();
            this.renderMapMarkers();
        } catch (e) {
            console.error("Fehler beim Laden der data.json", e);
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

            const tableGuests = this.data.guests
                .filter(g => g.tableId === table.id)
                .sort((a, b) => parseInt(a.seat || 0) - parseInt(b.seat || 0));

            if (table.id === 't-braut') {
                let guestsHtml = tableGuests.map(g => `
                    <div class="guest-row">
                        <span class="guest-seat">${g.seat}</span>
                        <span class="guest-name">${g.name}</span>
                    </div>
                `).join('');
                marker.innerHTML = `
                    <div class="table-header"><span>💍 Brauttisch</span></div>
                    <div class="braut-guests-grid">${guestsHtml}</div>
                `;
            } else {
                let tableNumber = table.name.replace('Tisch ', '');
                let guestsHtml = tableGuests.length > 0 
                    ? tableGuests.map(g => `
                        <div class="guest-row">
                            <span class="guest-seat">${g.seat}</span>
                            <span class="guest-name">${g.name}</span>
                        </div>
                    `).join('')
                    : '<div class="guest-row"><span class="guest-name" style="grid-column: span 2; text-align:center;">Frei</span></div>';

                marker.innerHTML = `
                    <div class="table-header">
                        <span>${table.name}</span>
                        <span style="background:var(--gold-light); padding:1px 4px; border-radius:4px; font-size:0.55rem;">${tableNumber}</span>
                    </div>
                    <div class="table-guests-list">${guestsHtml}</div>
                `;
            }

            layer.appendChild(marker);
        });
    }

    initAdmin() {
        const triggerBtn = document.getElementById('admin-trigger-btn');
        const dialog = document.getElementById('admin-dialog');
        const loginBtn = document.getElementById('admin-login-btn');
        const closeBtn = document.getElementById('admin-close-btn');

        if (triggerBtn && dialog) {
            triggerBtn.addEventListener('click', () => {
                document.getElementById('admin-password').value = '';
                document.getElementById('admin-auth').classList.remove('hidden');
                document.getElementById('admin-panel').classList.add('hidden');
                dialog.showModal();
            });
        }

        if (closeBtn && dialog) {
            closeBtn.addEventListener('click', () => dialog.close());
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const passwordInput = document.getElementById('admin-password').value;
                
                // Passwort ist hier direkt und felsenfest hinterlegt
                if (passwordInput === "hochzeit") {
                    document.getElementById('admin-auth').classList.add('hidden');
                    document.getElementById('admin-panel').classList.remove('hidden');
                    this.renderAdminList();
                } else {
                    alert("Falsches Passwort!");
                }
            });
        }

        const addBtn = document.getElementById('add-guest-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addNewGuest());
        }
        
        const select = document.getElementById('new-guest-table');
        if (select && this.data.tables) {
            select.innerHTML = this.data.tables.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
    }

    renderAdminList() {
        const listContainer = document.getElementById('admin-guest-list');
        if (!listContainer) return;

        listContainer.innerHTML = this.data.guests.map(g => {
            const table = this.data.tables.find(t => t.id === g.tableId);
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.3rem 0; border-bottom:1px solid #f0f0f0;">
                    <span><b>${g.name}</b> (Platz ${g.seat} - ${table ? table.name : 'Kein Tisch'})</span>
                    <button data-id="${g.id}" class="delete-guest-btn btn-secondary" style="font-size:0.7rem; padding:0.2rem 0.4rem;">Löschen</button>
                </div>
            `;
        }).join('');

        listContainer.querySelectorAll('.delete-guest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.data.guests = this.data.guests.filter(g => g.id !== id);
                this.renderAdminList();
                this.renderMapMarkers();
            });
        });
    }

    addNewGuest() {
        const name = document.getElementById('new-guest-name').value.trim();
        const seat = document.getElementById('new-guest-seat').value.trim();
        const tableId = document.getElementById('new-guest-table').value;

        if (!name) {
            alert("Bitte Namen eingeben!");
            return;
        }

        const newGuest = {
            id: 'g_' + Date.now(),
            name: name,
            seat: seat || "0",
            tableId: tableId
        };

        this.data.guests.push(newGuest);
        document.getElementById('new-guest-name').value = '';
        document.getElementById('new-guest-seat').value = '';
        
        this.renderAdminList();
        this.renderMapMarkers();
        alert("Gast erfolgreich hinzugefügt!");
    }

    onGuestSelected(guest) {
        const mapSection = document.getElementById('map-section');
        if (mapSection) mapSection.classList.remove('hidden');
        
        const table = this.data.tables.find(t => t.id === guest.tableId);
        document.getElementById('target-guest-info').innerText = `${guest.name} ➔ ${table ? table.name : 'Tisch'}, Sitzplatz ${guest.seat}`;
        
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
                setTimeout(() => targetMarker.classList.remove('highlight'), 5000);

                const container = document.getElementById('map-container');
                if (container) {
                    const scale = 1.4;
                    const tx = (450 - (table.x / 100) * 900) * (scale - 1) / scale;
                    const ty = (475 - (table.y / 100) * 950) * (scale - 1) / scale;
                    container.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
                }
            }
        }

        triggerConfetti();
    }

    resetMap() {
        const container = document.getElementById('map-container');
        if (container) {
            container.style.transform = 'translate(0px, 0px) scale(1)';
        }
        document.querySelectorAll('.table-marker').forEach(m => m.classList.remove('highlight'));
        document.getElementById('target-guest-info').innerText = "Gesamter Saalplan";
        document.getElementById('speech-banner').classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeddingApp();
    app.init();
});
