document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');

  const apply = mode => {
    const dark = mode === 'dark';
    document.documentElement.classList.toggle('dark-mode', dark);
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    localStorage.setItem('theme', mode);
  };

  apply(document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');

  btn.addEventListener('click', () => {
    apply(document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark');
  });
});
