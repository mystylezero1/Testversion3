export function initSearch(guests, onSelectGuest) {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const dialog = document.getElementById('disambiguation-dialog');
    const dialogList = document.getElementById('disambiguation-list');
    const closeBtn = document.getElementById('disambiguation-close-btn');

    closeBtn.addEventListener('click', () => dialog.close());

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        resultsContainer.innerHTML = ''; 
        
        if (query.length < 2) return;

        const matches = guests.filter(g => g.name.toLowerCase().includes(query));
        
        matches.forEach(guest => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerText = `${guest.name} (Sitzplatz ${guest.seat})`;
            
            item.addEventListener('click', () => processSelection(guest.name, matches));
            resultsContainer.appendChild(item);
        });
    });

    function processSelection(selectedName, matches) {
        resultsContainer.innerHTML = '';
        searchInput.value = selectedName;

        const duplicates = matches.filter(g => g.name.toLowerCase() === selectedName.toLowerCase());

        if (duplicates.length > 1) {
            showDisambiguation(duplicates);
        } else if (duplicates.length === 1) {
            onSelectGuest(duplicates[0]);
        }
    }

    function showDisambiguation(duplicates) {
        dialogList.innerHTML = '';
        duplicates.forEach(guest => {
            const btn = document.createElement('button');
            btn.className = 'btn-creme';
            btn.innerText = `${guest.name} (Sitzplatz ${guest.seat})`;
            
            btn.addEventListener('click', () => {
                dialog.close();
                onSelectGuest(guest);
            });
            dialogList.appendChild(btn);
        });
        
        dialog.showModal();
    }
}
