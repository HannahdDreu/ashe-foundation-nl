document.querySelectorAll('[data-dropdown-toggle]').forEach(button => {
    button.addEventListener('click', function () {
        const menuId = this.getAttribute('data-dropdown-toggle');
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.classList.toggle('hidden');
        }
    });
});
