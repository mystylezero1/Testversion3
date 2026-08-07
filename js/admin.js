export class AdminModule {
    constructor(data, onUpdate) {
        this.data = data;
        this.onUpdate = onUpdate;
        this.init();
    }

    init() {
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
                
                // Hier kannst du das Passwort nach Wunsch anpassen
                const correctPassword = "hochzeit"; 

                if (passwordInput === correctPassword) {
                    document.getElementById('admin-auth').classList.add('hidden');
                    document.getElementById('admin-panel').classList.remove('hidden');
                    this.renderAdminList();
                } else {
                    alert("Falsches Passwort!");
                }
            });
        }

        document.getElementById('add-guest-btn').addEventListener('click', () => this.addNewGuest());
        
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
                if (this.onUpdate) this.onUpdate(this.data);
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
        if (this.onUpdate) this.onUpdate(this.data);
        alert("Gast erfolgreich hinzugefügt!");
    }
}
