export class SearchModule {
    constructor(guests, onSelectGuest) {
        this.guests = guests;
        this.onSelectGuest = onSelectGuest;
        this.input = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        this.dialog = document.getElementById('disambiguation-dialog');
        this.dialogList = document.getElementById('disambiguation-list');
        this.closeBtn = document.getElementById('disambiguation-close-btn');
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.dialog.close());

        this.input.addEventListener('input', () => {
            const query = this.input.value.trim().toLowerCase();
            this.resultsContainer.innerHTML = '';
            
            if (query.length < 2) return;

            const matches = this.guests.filter(g => g.name.toLowerCase().includes(query));
            
            matches.forEach(guest => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerText = `${guest.name} (Sitzplatz ${guest.seat})`;
                
                item.addEventListener('click', () => {
                    this.input.value = guest.name;
                    this.resultsContainer.innerHTML = '';
                    
                    const duplicates = this.guests.filter(g => g.name.toLowerCase() === guest.name.toLowerCase());
                    if (duplicates.length > 1) {
                        this.showDisambiguation(duplicates);
                    } else {
                        this.onSelectGuest(guest);
                    }
                });
                this.resultsContainer.appendChild(item);
            });
        });
    }

    showDisambiguation(duplicates) {
        this.dialogList.innerHTML = '';
        duplicates.forEach(guest => {
            const btn = document.createElement('button');
            btn.className = 'btn-creme';
            btn.innerText = `${guest.name} (Sitzplatz ${guest.seat} am ${guest.tableId})`;
            
            btn.addEventListener('click', () => {
                this.dialog.close();
                this.onSelectGuest(guest);
            });
            this.dialogList.appendChild(btn);
        });
        this.dialog.showModal();
    }
}
