async function getTopTracks() {
    const username = 'kadeusz';
    const apiKey = '57a54401eba0ec9ece0fa7c4724d0682';

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
        let nowPlaying;
        if (track['@attr'] && track['@attr'].nowplaying) {
            nowPlaying = {
                artist: track.artist['#text'],
                track: track.name,
                album: track.album['#text'],
                image: track.image.find(img => img.size === 'large')['#text']
                
            };
            
        } else {
            nowPlaying = {
                artist: "Nothing",
                track: "",
                album: "",
                //albumArt: "assets/ed18392a24e4a718d5bf11663d5e2b07.jpg" // Your default image
            };
            console.log('No track currently playing.', nowPlaying);
        }
        updateNowPlaying(nowPlaying);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateNowPlaying(nowPlaying) {
    const songTitle = document.getElementById('current-track');
    const albumArtElement = document.getElementById('album-art');
    
    let fullTitle = nowPlaying.track ? `${nowPlaying.track} by ${nowPlaying.artist}` : 'No track currently playing';
    
    // Sprawdzanie długości tekstu i przycinanie
    if (fullTitle.length > 40) {
        fullTitle = fullTitle.slice(0, 40) + '...';
    }
    
    songTitle.textContent = fullTitle;
    albumArtElement.src = nowPlaying.image ? nowPlaying.image : "assets/ed18392a24e4a718d5bf11663d5e2b07.jpg";
    albumArtElement.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    getTopTracks(); 
    setInterval(getTopTracks, 3000);
});
