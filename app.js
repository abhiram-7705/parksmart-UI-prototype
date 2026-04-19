function goTo(page) {
  window.location.href = page;
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}