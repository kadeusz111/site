const linkText     = document.getElementById('linkText');
const downloadLink = document.getElementById('downloadLink');

const WORKER_URL = 'https://purple-leaf-50d8.kadeusz-tarwowski.workers.dev/?id=';
const YT_REGEX   = /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

let cachedDownloadUrl = null;

linkText.addEventListener('input', async () => {
  const text = linkText.innerText.trim();
  const match = text.match(YT_REGEX);

  if (!match) {
    downloadLink.style.display = 'none';
    cachedDownloadUrl = null;
    return;
  }

  downloadLink.style.display = 'inline-block';
  cachedDownloadUrl = null;

  try {
    const res = await fetch(WORKER_URL + match[1]);

    if (!res.ok) throw new Error('Błąd API');

    const data = await res.json();

    if (data.url) {
      cachedDownloadUrl = data.url;
      console.log('Znaleziono link do pobrania:', cachedDownloadUrl);
    } else {
      cachedDownloadUrl = null;
      console.warn('Brak URL w odpowiedzi API');
    }
  } catch (err) {
    cachedDownloadUrl = null;
    console.error('Błąd pobierania linku:', err);
  }
});

downloadLink.addEventListener('click', e => {
  e.preventDefault();
  if (!cachedDownloadUrl) {
    alert('Brak linku do pobrania w 720p z audio');
    return;
  }
  const a = document.createElement('a');
  a.href = cachedDownloadUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

downloadLink.style.display = 'none';
