import { exportToExcel } from './excel.js';

export class AdminModule {
    constructor(data, onDataChanged) {
        this.data = data;
        this.onDataChanged = onDataChanged;
        this.dialog = document.getElementById('admin-dialog');
        this.triggerBtn = document.getElementById('admin-trigger-btn');
        this.loginBtn = document.getElementById('admin-login-btn');
        this.closeBtn = document.getElementById('admin-close-btn');
        this.exportBtn = document.getElementById('excel-export-btn');
        this.addBtn = document.getElementById('add-guest-btn');
        this.init();
    }

    init() {
        this.triggerBtn.addEventListener('click', () => {
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-auth').classList.remove('hidden');
            document.getElementById('admin-panel').classList.add('hidden');
            this.dialog.showModal();
        });

        this.closeBtn.addEventListener('click', () => this.dialog.close());

        this.loginBtn.addEventListener('click', () => {
            const pwd = document.getElementById('admin-password').value;
            if (pwd === "admin123") {
                document.getElementById('admin-auth').classList.add('hidden');
                document.getElementById('admin-panel').classList.remove('hidden');
                this.renderAdminList();
                this.populateTableSelect();
            } else {
                alert("Falsches Passwort!");
            }
        });

        this.exportBtn.addEventListener('click', () => exportToExcel(this.data.guests, this.data.tables));

        this.addBtn.addEventListener('click', () => {
            const name = document.getElementById('new-guest-name').value.trim();
            const seat = parseInt(document.getElementById('new-guest-seat').value);
            const tableId = document.getElementById('new-guest-table').value;

            if (!name || isNaN(seat)) {
                alert("Bitte Name und Sitzplatz angeben.");
                return;
            }

            const newGuest = { id: 'g_' + Date.now(), name, seat, tableId };
            this.data.guests.push(newGuest);
            this.onDataChanged(this.data);
            this.renderAdminList();
            document.getElementById('new-guest-name').value = '';
            document.getElementById('new-guest-seat').value = '';
            alert("Gast erfolgreich hinzugefügt!");
        });
    }

    populateTableSelect() {
        const select = document.getElementById('new-guest-table');
        select.innerHTML = '';
        this.data.tables.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.innerText = t.name;
            select.appendChild(opt);
        });
    }

    renderAdminList() {
        const listDiv = document.getElementById('admin-guest-list');
        listDiv.innerHTML = '';
        this.data.guests.forEach((g, index) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.padding = '4px 0';
            item.style.borderBottom = '1px solid #eee';
            
            const table = this.data.tables.find(t => t.id === g.tableId);
            item.innerHTML = `<span>${g.name} (Pl. ${g.seat}, ${table ? table.name : 'Tisch'})</span>`;
            
            const delBtn = document.createElement('button');
            delBtn.innerText = '❌';
            delBtn.style.border = 'none';
            delBtn.style.background = 'transparent';
            delBtn.style.cursor = 'pointer';
            delBtn.onclick = () => {
                this.data.guests.splice(index, 1);
                this.onDataChanged(this.data);
                this.renderAdminList();
            };

            item.appendChild(delBtn);
            listDiv.appendChild(item);
        });
    }
}
