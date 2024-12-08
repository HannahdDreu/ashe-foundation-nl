document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('[data-collapse-toggle="mobile-menu"]').addEventListener('click', function () {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    });
  });
  
