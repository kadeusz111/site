// ===== WAKATIME =====
fetch('https://wakatime.kadeusz-tarwowski.workers.dev/', { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('stats-list');

    if (!list) {
      console.error('Brak elementu #stats-list w HTML');
      return;
    }

    data.data.languages.forEach(lang => {
      if (lang.name === "Other") return;
      const totalSeconds = lang.total_seconds;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const li = document.createElement('li');
      li.style.position = 'relative';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'languagestext';
      nameSpan.textContent = lang.name;

      const timeSpan = document.createElement('span');
      timeSpan.className = 'languageshour';
      timeSpan.textContent = ` ${hours}hrs ${minutes}minutes`;

      li.appendChild(nameSpan);
      li.appendChild(timeSpan);
      list.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Błąd przy pobieraniu danych z WakaTime:', error);
  });

// ===== IKONY =====
window.addEventListener('DOMContentLoaded', () => {
  const svgIcon = document.getElementById('icon-github');
  const link = document.getElementById('github-link');

  if (svgIcon && link) {
    const clone = svgIcon.cloneNode(true);
    clone.removeAttribute('id');
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
window.addEventListener('DOMContentLoaded', () => {
  const spotifyIcon = document.getElementById('icon-discord');
  const spotifyLink = document.getElementById('discord-link');

  if (spotifyIcon && spotifyLink) {
    const clone = spotifyIcon.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.width = '24px';
    clone.style.height = '24px';
    spotifyLink.appendChild(clone);
  }
});

// ===== LAST.FM: Recently Played =====
async function getRecentlyPlayed() {
  const username = 'kadeusz';
  const apiKey = process.env.MY_API_KEY;

  try {
    const response = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
      params: {
        method: 'user.getRecentTracks',
        user: username,
        api_key: apiKey,
        format: 'json',
        limit: 1
      }
    });

    const track = response.data.recenttracks.track[0];
    const lastPlayed = {
      artist: track.artist['#text'] || "Unknown Artist",
      track: track.name || "Unknown Track",
      image: track.image?.find(img => img.size === 'large')?.['#text'] || "assets/cover.jpg"
    };

    updateRecentlyPlayed(lastPlayed);
  } catch (error) {
    console.error('Error fetching recently played track:', error);
  }
}

function updateRecentlyPlayed(trackData) {
  const songTitleElement = document.querySelector('.song-title');
  const songArtistElement = document.querySelector('.song-artist');
  const coverElement = document.querySelector('.cover');

  // Przycinanie długiego tytułu
  let fullTitle = trackData.track;
  if (fullTitle.length > 40) {
    fullTitle = fullTitle.slice(0, 40) + '...';
  }

  songTitleElement.textContent = fullTitle;
  songArtistElement.textContent = trackData.artist;
  coverElement.src = trackData.image;
}

// Uruchomienie po załadowaniu strony i odświeżanie co 15s
document.addEventListener('DOMContentLoaded', () => {
  getRecentlyPlayed();
  setInterval(getRecentlyPlayed, 180000);
});

