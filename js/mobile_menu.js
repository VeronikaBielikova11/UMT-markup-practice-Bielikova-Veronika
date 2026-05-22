const menuBtnRef = document.querySelector('[data-menu_button]');
const mobileMenuRef = document.querySelector('[data-menu]');
const mobileMenuLinkRef = document.querySelectorAll('.menu_navigation_link');

menuBtnRef.addEventListener('click', () => {
  window.scrollTo(0, 0);

  const expanded = menuBtnRef.getAttribute('aria-expanded') === 'true';
  menuBtnRef.setAttribute('aria-expanded', !expanded);

  menuBtnRef.classList.toggle('is-open');
  document.body.classList.toggle('menu-open');
  mobileMenuRef.classList.toggle('is-open');
});

mobileMenuLinkRef.forEach((ref) => {
  ref.addEventListener('click', () => {
    menuBtnRef.setAttribute('aria-expanded', false);
    document.body.classList.remove('menu-open');
    menuBtnRef.classList.remove('is-open');

    mobileMenuRef.classList.remove('is-open');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1440) {
    menuBtnRef.setAttribute('aria-expanded', false);
    document.body.classList.remove('menu-open');

    menuBtnRef.classList.remove('is-open');

    mobileMenuRef.classList.remove('is-open');
  }
});
