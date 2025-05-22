const username = 'kadeusz111'; // wpisz tu swój nick z GitHub

async function getRepos() {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!response.ok) {
    document.getElementById('repoList').innerText = 'Błąd podczas pobierania repozytoriów';
    return;
  }
  const repos = await response.json();
  const container = document.getElementById('repoList');
  container.innerHTML = '';

const maxVisible = 6;

}
getRepos();

window.addEventListener('DOMContentLoaded', () => {
  const svgIcon = document.getElementById('icon-github');
  const link = document.getElementById('github-link');

  if (svgIcon && link) {
    const clone = svgIcon.cloneNode(true);
    clone.removeAttribute('id'); // usuń id, żeby nie było duplikatu
    clone.style.width = '24px';
    clone.style.height = '24px';
    link.appendChild(clone);
  }
});

  window.addEventListener('DOMContentLoaded', () => {
    const spotifyIcon = document.getElementById('icon-spotify');
    const spotifyLink = document.getElementById('spotify-link');

    if (spotifyIcon && spotifyLink) {
      const clone = spotifyIcon.cloneNode(true);
      clone.removeAttribute('id');
      clone.style.width = '24px';
      clone.style.height = '24px';
      spotifyLink.appendChild(clone);
    }
  });