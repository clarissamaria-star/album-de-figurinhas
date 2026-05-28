const albumOverlay = document.querySelector("#albumOverlay");
const missionOverlay = document.querySelector("#missionOverlay");
const openAlbumFromMenu = document.querySelector("#openAlbumFromMenu");
const closeAlbum = document.querySelector("#closeAlbum");
const openSportsMission = document.querySelector("#openSportsMission");
const closeMission = document.querySelector("#closeMission");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const checkinGrid = document.querySelector("#checkinGrid");
const albumCover = document.querySelector("#albumCover");
const albumPage = document.querySelector("#albumPage");
const pageStickers = document.querySelector("#pageStickers");
const pageBrand = document.querySelector("#pageBrand");
const pageProvider = document.querySelector("#pageProvider");
const pageRange = document.querySelector("#pageRange");
const pageLabel = document.querySelector("#pageLabel");
const pageSlider = document.querySelector("#pageSlider");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const albumOwnedCounter = document.querySelector("#albumOwnedCounter");
const albumProgressBar = document.querySelector("#albumProgressBar");
const pageTurn = document.querySelector("#pageTurn");

const bronzeNames = [
  "Atlanta", "Boston", "Cidade do Mexico", "Dallas", "Guadalajara", "Houston", "Kansas City", "Los Angeles", "Miami",
  "Monterrey", "Filadelfia", "Sao Francisco", "Seattle", "Toronto", "Vancouver", "New York",
];

const silverNames = [
  "Uniforme Africa do Sul", "Bandeira Africa do Sul", "Bandeira Arabia Saudita", "Uniforme Arabia Saudita",
  "Bandeira Argelia", "Uniforme Argelia", "Bandeira Australia", "Uniforme Australia", "Bandeira Austria",
  "Uniforme Austria", "Bandeira Belgica", "Uniforme Belgica", "Bandeira Bosnia", "Uniforme Bosnia",
  "Bandeira Cabo Verde", "Uniforme Cabo Verde", "Uniforme Campea 1", "Uniforme Campea 2", "Uniforme Campea 3",
  "Uniforme Campea 4", "Uniforme Campea 5", "Uniforme Campea 6", "Bandeira Canada", "Uniforme Canada",
  "Bandeira Catar", "Uniforme Catar", "Bandeira Colombia", "Uniforme Colombia", "Bandeira Coreia do Sul",
  "Uniforme Coreia do Sul", "Bandeira Costa do Marfim", "Uniforme Costa do Marfim", "Bandeira Croacia",
  "Uniforme Croacia", "Bandeira Curacao", "Uniforme Curacao", "Bandeira Egito", "Uniforme Egito",
  "Bandeira Equador", "Uniforme Equador", "Bandeira Escocia", "Uniforme Escocia", "Bandeira Estados Unidos",
  "Uniforme Estados Unidos", "Bandeira Gana", "Uniforme Gana", "Bandeira Haiti", "Uniforme Haiti",
  "Bandeira Holanda", "Uniforme Holanda", "Bandeira Ira", "Uniforme Ira", "Bandeira Iraque", "Uniforme Iraque",
  "Bandeira Japao", "Uniforme Japao", "Bandeira Jordania", "Uniforme Jordania", "Bandeira Marrocos",
  "Uniforme Marrocos", "Bandeira Mexico", "Uniforme Mexico", "Bandeira Noruega", "Uniforme Noruega",
  "Bandeira Nova Zelandia", "Uniforme Nova Zelandia", "Bandeira Panama", "Uniforme Panama", "Bandeira Paraguai",
  "Uniforme Paraguai", "Bandeira Portugal", "Uniforme Portugal", "Bandeira RD Congo", "Uniforme RD Congo",
  "Bandeira Rep. Tcheca", "Uniforme Rep. Tcheca", "Bandeira Senegal", "Uniforme Senegal", "Bandeira Suecia",
  "Uniforme Suecia", "Bandeira Suica", "Uniforme Suica", "Bandeira Tunisia", "Uniforme Tunisia",
  "Bandeira Turquia", "Uniforme Turquia", "Bandeira Uzbequistao", "Uniforme Uzbequistao", "Uniforme Inglaterra",
];

const goldNames = ["Alemanha", "Argentina", "Brasil", "Espanha", "Franca", "Inglaterra", "Uruguai", "Especial Sabia"];
const diamondNames = ["Diamante 1", "Diamante 2", "Diamante 3", "Diamante 4", "Diamante 5"];

const stickers = [
  ...bronzeNames.map((name, index) => ({ id: `B-${String(index + 1).padStart(3, "0")}`, name, rarity: "Bronze", owned: name === "Guadalajara" })),
  ...silverNames.map((name, index) => ({ id: `S-${String(index + 1).padStart(3, "0")}`, name, rarity: "Prata", owned: false })),
  ...goldNames.map((name, index) => ({ id: `G-${String(index + 1).padStart(3, "0")}`, name, rarity: "Ouro", owned: false })),
  ...diamondNames.map((name, index) => ({ id: `D-${String(index + 1).padStart(3, "0")}`, name, rarity: "Diamante", owned: false })),
];

const rarityColors = {
  Bronze: "#cd7f32",
  Prata: "#cfd5df",
  Ouro: "#ffd65a",
  Diamante: "#86eaff",
};

const pageThemes = [
  { brand: "Copa 2026", theme: "stadium", provider: "" },
  { brand: "Tatu do Bem", theme: "party", provider: "PopOK" },
  { brand: "Spaceman", theme: "space", provider: "Pragmatic Play" },
  { brand: "Soccer Strike", theme: "strike", provider: "Games Global" },
  { brand: "Ronaldinho Streetball", theme: "street", provider: "Booming Games" },
  { brand: "JetX", theme: "jetx", provider: "SmartSoft Gaming" },
  { brand: "Gates of Olympus", theme: "olympus", provider: "SmartSoft Gaming" },
  { brand: "Football X", theme: "footballx", provider: "SmartSoft Gaming" },
  { brand: "Duck Hunters", theme: "duck", provider: "Evolution" },
  { brand: "Big Bass Bonanza", theme: "bass", provider: "Pragmatic Play" },
  { brand: "Brasil", theme: "stadium", provider: "" },
  { brand: "Mundo", theme: "space", provider: "" },
  { brand: "Ouro", theme: "party", provider: "" },
  { brand: "Diamantes", theme: "strike", provider: "" },
  { brand: "Finais", theme: "street", provider: "" },
  { brand: "Completar Album", theme: "stadium", provider: "" },
];

let currentPage = 0;
let flipTimer = null;

function openAlbum() {
  albumOverlay.classList.add("is-visible");
}

function closeAlbumModal() {
  albumOverlay.classList.remove("is-visible");
}

function openMissionDetail() {
  missionOverlay.classList.add("is-visible");
  missionOverlay.setAttribute("aria-hidden", "false");
}

function closeMissionDetail() {
  missionOverlay.classList.remove("is-visible");
  missionOverlay.setAttribute("aria-hidden", "true");
}

openAlbumFromMenu.addEventListener("click", openAlbum);
closeAlbum.addEventListener("click", closeAlbumModal);

// Bottom nav mobile — botão do álbum
const openAlbumMobile = document.querySelector("#openAlbumMobile");
if (openAlbumMobile) openAlbumMobile.addEventListener("click", openAlbum);
openSportsMission.addEventListener("click", openMissionDetail);
closeMission.addEventListener("click", closeMissionDetail);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === target));
  });
});

checkinGrid.innerHTML = Array.from({ length: 16 }, (_, index) => {
  const day = index + 1;
  const status = index === 0 ? "claimed" : index === 1 ? "available" : "locked";
  const reward = day === 16 ? "Bônus especial" : "Figurinhas bônus";
  const rarity = [4, 8, 12, 16].includes(day) ? "Ouro" : [6, 10, 14].includes(day) ? "Prata" : "Bronze";
  const label = { claimed: "Resgatado", available: "Disponível", locked: "Bloqueado" }[status];

  return `
    <article class="day-card ${status}">
      <div class="checkin-reward-art rarity-${rarity.toLowerCase()}">
        <span>${day}</span>
      </div>
      <div class="checkin-copy">
        <strong>Check-in ${day}</strong>
        <span>${reward}</span>
        <small>${rarity} · 01 figurinha</small>
      </div>
      <div class="checkin-status">${label}</div>
    </article>
  `;
}).join("");

function renderAlbumPage() {
  const owned = stickers.filter((item) => item.owned).length;
  albumOwnedCounter.textContent = `${owned}/141`;
  albumProgressBar.style.width = `${Math.max(1, Math.round((owned / 141) * 100))}%`;
  pageSlider.value = String(currentPage);
  pageLabel.textContent = `Página ${currentPage} de 16`;
  prevPage.disabled = currentPage === 0;
  nextPage.disabled = currentPage === 16;

  albumCover.classList.toggle("is-active", currentPage === 0);
  albumPage.classList.toggle("is-active", currentPage > 0);

  if (currentPage === 0) return;

  const pageIndex = currentPage - 1;
  const start = pageIndex * 9;
  const pageItems = stickers.slice(start, start + 9);
  const theme = pageThemes[pageIndex] || pageThemes[0];

  albumPage.className = `album-page sticker-page is-active theme-${theme.theme}`;
  pageBrand.textContent = theme.brand;
  pageProvider.textContent = theme.provider || "";
  pageRange.textContent = `${start + 1}-${Math.min(start + pageItems.length, 141)} de 141`;
  pageStickers.innerHTML = pageItems.map((item) => {
    const rarityClass = item.rarity.toLowerCase();
    return `
      <article class="book-sticker ${item.owned ? "is-owned" : ""} rarity-${rarityClass}" style="--rarity-color: ${rarityColors[item.rarity]}">
        <span class="rarity-code">${item.id.slice(0, 1)}-</span>
        <div class="owned-art"></div>
        <strong>${item.name}</strong>
      </article>
    `;
  }).join("");
}

function playPageTurn(nextPageNumber) {
  const next = Math.max(0, Math.min(16, Number(nextPageNumber)));
  if (next === currentPage) return;

  pageTurn.className = "page-turn";
  pageTurn.classList.add(next > currentPage ? "turn-forward" : "turn-backward");

  window.clearTimeout(flipTimer);
  flipTimer = window.setTimeout(() => {
    pageTurn.className = "page-turn";
  }, 720);
}

function setAlbumPage(page, animate = true) {
  const next = Math.max(0, Math.min(16, Number(page)));
  if (animate) playPageTurn(next);
  currentPage = next;
  renderAlbumPage();
}

pageSlider.addEventListener("input", (event) => setAlbumPage(event.target.value));
prevPage.addEventListener("click", () => setAlbumPage(currentPage - 1));
nextPage.addEventListener("click", () => setAlbumPage(currentPage + 1));

// Teclado: setas esquerda/direita
document.addEventListener("keydown", (event) => {
  const stickersOpen = document.querySelector("#stickers").classList.contains("is-active");
  if (!stickersOpen) return;
  if (event.key === "ArrowLeft")  setAlbumPage(currentPage - 1);
  if (event.key === "ArrowRight") setAlbumPage(currentPage + 1);
});

// Scroll do mouse sobre o álbum
const albumShell = document.querySelector(".album-page-shell");
let wheelTimer = null;
albumShell.addEventListener("wheel", (event) => {
  event.preventDefault();
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    if (event.deltaY > 0 || event.deltaX > 0) setAlbumPage(currentPage + 1);
    else                                       setAlbumPage(currentPage - 1);
  }, 60);
}, { passive: false });

// Clique na metade esquerda/direita da página para navegar
albumShell.addEventListener("click", (event) => {
  // ignora cliques nos botões de controle
  if (event.target.closest(".nav-button, .page-slider, .grid-toggle")) return;
  const rect = albumShell.getBoundingClientRect();
  const mid  = rect.left + rect.width / 2;
  if (event.clientX < mid) setAlbumPage(currentPage - 1);
  else                      setAlbumPage(currentPage + 1);
});

// Swipe touch (mobile)
let touchStartX = 0;
let touchStartY = 0;
albumShell.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

albumShell.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Só ativa se for swipe horizontal (dx > dy)
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) setAlbumPage(currentPage + 1); // swipe left = próxima
    else        setAlbumPage(currentPage - 1); // swipe right = anterior
  }
}, { passive: true });

// Cursor de mão ao passar pelo álbum
albumShell.style.cursor = "pointer";

renderAlbumPage();
