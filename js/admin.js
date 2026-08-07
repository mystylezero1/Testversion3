export function initAdmin() {
    const triggerBtn = document.getElementById('admin-trigger-btn');
    const dialog = document.getElementById('admin-dialog');
    const loginBtn = document.getElementById('admin-login-btn');
    const closeBtn = document.getElementById('admin-close-btn');
    const passwordInput = document.getElementById('admin-password');
    const authDiv = document.getElementById('admin-auth');
    const panelDiv = document.getElementById('admin-panel');

    triggerBtn.addEventListener('click', () => {
        passwordInput.value = '';
        authDiv.classList.remove('hidden');
        panelDiv.classList.add('hidden');
        dialog.showModal();
    });

    closeBtn.addEventListener('click', () => dialog.close());

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === "admin123") { // Einfaches Passwort
            authDiv.classList.add('hidden');
            panelDiv.classList.remove('hidden');
        } else {
            alert("Falsches Passwort!");
        }
    });
}
