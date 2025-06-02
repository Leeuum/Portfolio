document.addEventListener('DOMContentLoaded', () => {
  const cb = document.getElementById('checkbox');            // use one id everywhere
  const txt = document.querySelector('.theme-switch-wrapper span');

  const apply = mode => {
    document.documentElement.classList.toggle('dark-mode', mode === 'dark');
    cb.checked = mode === 'dark';
    txt.textContent = mode === 'dark' ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', mode);
  };

  apply(document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');

  cb.addEventListener('change', () => apply(cb.checked ? 'dark' : 'light'));
}); 