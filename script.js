window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        const page = document.getElementById("page");

        page.style.display = "block";

        // pozwala przeglądarce "zauważyć" zmianę display
        requestAnimationFrame(() => {
            page.classList.add("show");
            loader.classList.add("hide");
        });

        // usuń loader po zakończeniu animacji
        setTimeout(() => {
            loader.style.display = "none";
        }, 600);

    }, 1000);
});

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("open");
}
document.addEventListener("click", (e) => {
  const sidebar = document.querySelector(".sidebar");
  const button = document.querySelector(".menu-toggle");

  if (!sidebar || !button) return;


  if (window.innerWidth > 1038) return;

  const clickedInsideSidebar = sidebar.contains(e.target);
  const clickedButton = button.contains(e.target);

  if (!clickedInsideSidebar && !clickedButton) {
    sidebar.classList.remove("open");
  }
});

let marqueeTimeout;

function startMarquee(element, distance) {
  clearTimeout(marqueeTimeout);

  element.style.transform = "translateX(0px)";

  function step() {
    // 1. 3s pauzy
    marqueeTimeout = setTimeout(() => {

      // 2. ruch w lewo
      element.style.transform = `translateX(${distance}px)`;

      marqueeTimeout = setTimeout(() => {

        // 3. 3s pauzy
        marqueeTimeout = setTimeout(() => {

          // 4. powrót
          element.style.transform = "translateX(0px)";

          // loop
          marqueeTimeout = setTimeout(step, 800);

        }, 1000);

      }, 2000); // czas przejazdu

    }, 4000);
  }

  step();
}

function restartMarqueeIfNeeded() {
  const title = document.querySelector('.music-title');
  if (!title) return;

  const text = title.textContent;

  if (!text) return;

  // wymusza ponowne przeliczenie animacji
  updateRecentlyPlayed({
    track: text,
    artist: document.querySelector('.music-artist')?.textContent || "",
    image: document.querySelector('.music-cover')?.src || ""
  });
}

window.addEventListener("resize", () => {
  restartMarqueeIfNeeded();
});

// ===== LAST.FM =====
async function getRecentlyPlayed() {
  try {
    const response = await fetch('https://lastfm.kadeusz-tarwowski.workers.dev/');
    const track = await response.json();
    updateRecentlyPlayed(track);
  } catch (error) {
    console.error('Error fetching recently played track:', error);
  }
}

function updateRecentlyPlayed(trackData) {
  const title = document.querySelector('.music-title');
  const artist = document.querySelector('.music-artist');
  const cover = document.querySelector('.music-cover');

  if (!title || !artist || !cover) return;

  const fullTitle = trackData.track;

  title.textContent = fullTitle;
  artist.textContent = trackData.artist;
  cover.src = trackData.image;

  // reset
  clearTimeout(marqueeTimeout);
  title.style.transform = "translateX(0px)";

  const isMobile = window.innerWidth <= 1038;
  const maxChars = isMobile ? 15 : 26;

  if (fullTitle.length > maxChars) {

    requestAnimationFrame(() => {
      const wrapper = title.parentElement;
      const distance = wrapper.offsetWidth - title.scrollWidth;

      startMarquee(title, distance);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getRecentlyPlayed();
  setInterval(getRecentlyPlayed, 180000);
});

// ===== WAKATIME WINDOW =====

  // Fetch WakaTime stats
  fetch('https://wakatime.kadeusz-tarwowski.workers.dev/', { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('stats-list');
      if (!list) return;

      list.style.listStyle = 'none';
      data.data.languages
        .filter(lang => lang.name !== "Other")
        .slice(0, 7)
        .forEach(lang => {
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
          timeSpan.textContent = ` - ${hours}hrs ${minutes}minutes`;

          li.appendChild(nameSpan);
          li.appendChild(timeSpan);
          list.appendChild(li);
      });
    })
    .catch(error => console.error('Błąd przy pobieraniu danych z WakaTime:', error));

// ===== drag + active window ====
let topZ = 1000;

function makeDraggable(windowEl, titlebarEl) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function setActive() {
    topZ++;
    windowEl.style.zIndex = topZ;
  }

  // WAŻNE dla mobile
  titlebarEl.style.touchAction = "none";

  windowEl.addEventListener("pointerdown", setActive);

titlebarEl.addEventListener("pointerdown", (e) => {

  if (e.target.closest("button, .close")) {
    return;
  }

  isDragging = true;

  offsetX = e.clientX - windowEl.offsetLeft;
  offsetY = e.clientY - windowEl.offsetTop;

  setActive();

  titlebarEl.setPointerCapture(e.pointerId);
});

  document.addEventListener("pointerup", () => {
    isDragging = false;
  });

  document.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    windowEl.style.left = `${e.clientX - offsetX}px`;
    windowEl.style.top = `${e.clientY - offsetY}px`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("wakatime-window");
  const openButton = document.querySelector(".wakatime-button");
  const titlebar = document.getElementById("wakatime-titlebar");

  const contactBox = document.getElementById("contact-window");
  const contactLink = document.getElementById("contact-link");
  const contactTitlebar = document.getElementById("contact-titlebar");

  const yuuriPetBox = document.getElementById("yuuri-pet-window");
  const yuuriPetLink = document.getElementById("yuuri-pet-link");
  const yuuriPetTitlebar = document.getElementById("yuuri-pet-titlebar");

  // ===== WAKATIME =====
  if (box && openButton && titlebar) {
    openButton.addEventListener("click", () => {
      box.style.display = "block";
    });

    window.closeBox = () => {
      box.style.display = "none";
    };

    makeDraggable(box, titlebar);
  }

  // ===== CONTACT =====
  if (contactBox && contactLink && contactTitlebar) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      contactBox.style.display = "block";
    });

    window.closeContact = () => {
      contactBox.style.display = "none";
    };

    makeDraggable(contactBox, contactTitlebar);
  }

// ===== YUURI PET =====
if (yuuriPetBox && yuuriPetLink && yuuriPetTitlebar) {

  yuuriPetLink.addEventListener("click", (e) => {
    e.preventDefault();
    yuuriPetBox.style.display = "block";
  });

  window.closeYuuriPet = () => {
    yuuriPetBox.style.display = "none";
  };

  makeDraggable(yuuriPetBox, yuuriPetTitlebar);
}


  // ===== URL OPEN CONTACT =====
  const params = new URLSearchParams(window.location.search);
  if (params.get("contact") === "open" && contactBox) {
    contactBox.style.display = "block";
  }
  if (params.get("yuuriPetBox") === "open" && yuuriPetBox) {
    yuuriPetBox.style.display = "block";
  }
});



// ===== Rozwijanie tools i other =====
const toolsLink = document.getElementById('tools-link');
const toolsSubmenu = document.getElementById('tools-submenu');

if (toolsLink && toolsSubmenu) {
  toolsLink.addEventListener('click', (e) => {
    e.preventDefault();
    toolsSubmenu.style.display = (toolsSubmenu.style.display === 'block') ? 'none' : 'block';
  });
}
const otherLink = document.getElementById('other-link');
const otherSubmenu = document.getElementById('other-submenu');

if (otherLink && otherSubmenu) {
  otherLink.addEventListener('click', (e) => {
    e.preventDefault();
    otherSubmenu.style.display = (otherSubmenu.style.display === 'block') ? 'none' : 'block';
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("contact") === "open") {
    const box = document.getElementById("contact-window");
    if (box) {
      box.style.display = "block";
    }
  }
});

// ===== Animacja śniegu =====
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const numFlakes = 100;
  const flakes = [];

  for (let i = 0; i < numFlakes; i++) {
    flakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      swing: Math.random() * 0.2
    });
  }

  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let f of flakes) {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    moveSnow();
  }

  function moveSnow() {
    for (let f of flakes) {
      f.y += f.speed;
      f.x += Math.sin(f.y * 0.01) * f.swing;
      if (f.y > canvas.height) {
        f.y = 0;
        f.x = Math.random() * canvas.width;
      }
    }
  }

  function animateSnow() {
    drawSnow();
    requestAnimationFrame(animateSnow);
  }

  animateSnow();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});


// Mapa liter ASCII w stylu Graffiti
const input = document.getElementById('ascii-input');
const button = document.getElementById('ascii-button');
const output = document.getElementById('ascii-output');

const asciiLetters = {
  "A": [
    "   ___   ",
    "  / _ \\  ",
    " / /_\\ \\ ",
    " |  _  | ",
    " | | | | ",
    " \\_| |_/ "
  ],
  "B": [
    " ______  ",
    " | ___ \\ ",
    " | |_/ / ",
    " | ___ \\ ",
    " | |_/ / ",
    " \\____/  "
  ],
  "C": [
    "  _____  ",
    " /  __ \\ ",
    " | /  \\/ ",
    " | |     ",
    " | \\__/\\ ",
    "  \\____/ "
  ],
  "D": [
    " ______  ",
    " |  _  \\ ",
    " | | | | ",
    " | | | | ",
    " | |/ /  ",
    " |___/   "
  ],
  "E": [
    " _____  ",
    " |  ___|",
    " | |__  ",
    " |  __| ",
    " | |___ ",
    " \\____/ "
  ],
  "F": [
    " _____  ",
    " |  ___|",
    " | |_   ",
    " |  _|  ",
    " | |    ",
    " \\_|    "
  ],
  "G": [
    "  _____ ",
    " /  __ \\",
    " | |  \\/",
    " | | __ ",
    " | |_\\ \\",
    "  \\____/"
  ],
  "H": [
    " _   _ ",
    " | | | |",
    " | |_| |",
    " |  _  |",
    " | | | |",
    " \\_| |_/"
  ],
  "I": [
    " _____ ",
    " |_   _|",
    "   | |  ",
    "   | |  ",
    "  _| |_ ",
    "  \\___/ "
  ],
  "J": [
    "     _  ",
    "    | | ",
    "    | | ",
    "    | | ",
    " /\\__/ /",
    " \\____/ "
  ],
  "K": [
    " _   __",
    " | | / /",
    " | |/ / ",
    " |    \\ ",
    " | |\\  \\",
    " \\_| \\_/"
  ],
  "L": [
    " _      ",
    " | |     ",
    " | |     ",
    " | |     ",
    " | |___  ",
    " \\____/  "
  ],
  "M": [
    " __  __ ",
    " |  \\/  |",
    " | .  . |",
    " | |\\/| |",
    " | |  | |",
    " \\_|  |_/"
  ],
  "N": [
    " _   _ ",
    " | \\ | |",
    " |  \\| |",
    " | . ` |",
    " | |\\  |",
    " \\_| \\_/"
  ],
  "O": [
    "  ____  ",
    " / __ \\ ",
    " | |  | |",
    " | |  | |",
    " | |__| |",
    "  \\____/ "
  ],
  "P": [
    " _____  ",
    " |  _  \\",
    " | |_| |",
    " |  __/ ",
    " | |    ",
    " \\_|    "
  ],
  "Q": [
    "  ____  ",
    " / __ \\ ",
    " | |  | |",
    " | |  | |",
    " | |__| |",
    "  \\___\\_\\"
  ],
  "R": [
    " _____  ",
    " |  _  \\",
    " | |_| |",
    " |  _ < ",
    " | |_| |",
    " \\____/ "
  ],
  "S": [
    "  _____ ",
    " /  ___|",
    " \\ `--. ",
    "  `--. \\",
    " /\\__/ /",
    " \\____/ "
  ],
  "T": [
    " _______",
    " |__   _|",
    "    | |  ",
    "    | |  ",
    "    | |  ",
    "    \\_/  "
  ],
  "U": [
    " _   _ ",
    " | | | |",
    " | | | |",
    " | | | |",
    " | |_| |",
    "  \\___/ "
  ],
  "V": [
    " _   _ ",
    " | | | |",
    " | | | |",
    " | | | |",
    " \\ \\_/ /",
    "  \\___/ "
  ],
  "W": [
    " _    _ ",
    " | |  | |",
    " | |  | |",
    " | |/\\| |",
    " |  /\\  |",
    " |_|  |_|"
  ],
  "X": [
    " __   __",
    " \\ \\ / /",
    "  \\ V / ",
    "  /   \\ ",
    " / /^\\ \\",
    " \\/   \\/"
  ],
  "Y": [
    " _   _ ",
    " | | | |",
    " | | | |",
    " \\ \\_/ /",
    "  \\   / ",
    "   \\_/  "
  ],
  "Z": [
    " ______",
    " |___  /",
    "    / / ",
    "   / /  ",
    "  / /__ ",
    " /_____|"
  ],
  " ": [
    "    ",
    "    ",
    "    ",
    "    ",
    "    ",
    "    "
  ]
};

// Funkcja generowania ASCII
function generateASCII(text) {
  const lines = ["", "", "", "", "", ""];
  text = text.toUpperCase();

  for (let char of text) {
    const ascii = asciiLetters[char] || asciiLetters[" "];
    for (let i = 0; i < lines.length; i++) {
      lines[i] += (ascii[i] || "      ") + "  ";
    }
  }

  return lines.join("\n");
}

button.addEventListener("click", () => {
  const text = input.value;
  if (!text) return;
  output.textContent = generateASCII(text);
});
