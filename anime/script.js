const username = 'kadeusz111'; // wpisz tu swój nick z GitHub

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

  async function searchAnime() {
  const query = document.getElementById("anime-search").value.trim();
  const resultsDiv = document.getElementById("anime-results");

  resultsDiv.innerHTML = ""; // wyczyść poprzednie wyniki

  if (!query) {
    resultsDiv.innerHTML = "<p>Search anime name!</p>";
    return;
  }

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    const data = await res.json();

    if (data.data.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.data.forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.style.width = "200px";
      animeCard.style.background = "#26263B";
      animeCard.style.borderRadius = "10px";
      animeCard.style.padding = "10px";
      animeCard.style.textAlign = "center";
      animeCard.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

      animeCard.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="width: 100%; border-radius: 8px;">
        <h3 style="font-size: 16px; color: #F1B9B5;">${anime.title}</h3>
        <p style="font-size: 14px;">${anime.year || "no year data"}</p>
        <a href="${anime.url}" target="_blank" style="font-size: 14px; color: #DFE0F5;">See on MAL</a>
      `;

      resultsDiv.appendChild(animeCard);
    });
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>An error occurred while downloading data.</p>";
  }
}
