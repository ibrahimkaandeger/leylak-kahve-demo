// ---- Ayarlar: müşteriye teslimde sadece burayı değiştir ----
const WHATSAPP_NO = "905000000000"; // ülke koduyla, başında + olmadan
const SAATLER = {
  // 0 = Pazar ... 6 = Cumartesi  →  [açılış, kapanış] (24 saat)
  0: [9, 23], 1: [8, 22], 2: [8, 22], 3: [8, 22], 4: [8, 22], 5: [8, 22], 6: [9, 23],
};
const MENU = {
  "Kahveler": [
    { ad: "Espresso", acik: "Ev kavurumu, tek köken", fiyat: 85 },
    { ad: "Flat White", acik: "Çift shot, ipeksi süt", fiyat: 120 },
    { ad: "Filtre Kahve", acik: "V60 · günün çekirdeği", fiyat: 110, rozet: "Önerilen" },
    { ad: "Cortado", acik: "Eşit oranda espresso ve süt", fiyat: 105 },
    { ad: "Latte", acik: "Sıcak veya buzlu", fiyat: 125 },
    { ad: "Türk Kahvesi", acik: "Közde, lokum ile", fiyat: 90 },
  ],
  "Soğuk": [
    { ad: "Cold Brew", acik: "18 saat demlenmiş", fiyat: 130 },
    { ad: "Ice Leylak Latte", acik: "Lavanta şurubu, oat süt", fiyat: 145, rozet: "İmza" },
    { ad: "Ev Yapımı Limonata", acik: "Taze nane ile", fiyat: 95 },
    { ad: "Espresso Tonic", acik: "Tonik, portakal kabuğu", fiyat: 135 },
  ],
  "Fırın": [
    { ad: "Tereyağlı Kruvasan", acik: "Her sabah taze", fiyat: 95 },
    { ad: "Tarçınlı Çörek", acik: "Krem peynir sosu ile", fiyat: 110, rozet: "Çok satan" },
    { ad: "Ekşi Maya Somun", acik: "Eve götürmek için, 750 g", fiyat: 160 },
    { ad: "Avokadolu Tost", acik: "Ekşi maya, poşe yumurta", fiyat: 210 },
  ],
  "Tatlı": [
    { ad: "San Sebastian", acik: "Dilim, sıcak çikolata ile", fiyat: 175 },
    { ad: "Havuçlu Kek", acik: "Ceviz ve tarçın", fiyat: 140 },
    { ad: "Brownie", acik: "Glutensiz, deniz tuzu", fiyat: 125 },
  ],
};
// -------------------------------------------------------------

const waLink = (text) => `https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(text)}`;

// Mobil menü
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  })
);

// Açık / kapalı durumu
function updateStatus() {
  const now = new Date();
  const [acilis, kapanis] = SAATLER[now.getDay()];
  const saat = now.getHours() + now.getMinutes() / 60;
  const acik = saat >= acilis && saat < kapanis;
  const dot = document.querySelector(".dot");
  dot.className = "dot " + (acik ? "open" : "closed");
  document.getElementById("status-text").textContent = acik
    ? `Şu an açığız · ${kapanis}:00'a kadar`
    : `Şu an kapalıyız · ${saat < acilis ? "bugün" : "yarın"} ${
        saat < acilis ? acilis : SAATLER[(now.getDay() + 1) % 7][0]
      }:00'da açılıyoruz`;
}
updateStatus();
setInterval(updateStatus, 60000);

// Menü sekmeleri
const tabs = document.getElementById("menu-tabs");
const grid = document.getElementById("menu-grid");
function renderMenu(kategori) {
  grid.innerHTML = MENU[kategori]
    .map(
      (u) => `
      <div class="menu-item">
        <div>
          <h3>${u.ad}${u.rozet ? `<span class="badge">${u.rozet}</span>` : ""}</h3>
          <p>${u.acik}</p>
        </div>
        <span class="price">${u.fiyat} ₺</span>
      </div>`
    )
    .join("");
  tabs.querySelectorAll(".tab").forEach((t) =>
    t.setAttribute("aria-selected", t.dataset.kategori === kategori)
  );
}
Object.keys(MENU).forEach((k) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.role = "tab";
  b.dataset.kategori = k;
  b.textContent = k;
  b.addEventListener("click", () => renderMenu(k));
  tabs.appendChild(b);
});
renderMenu(Object.keys(MENU)[0]);

// Rezervasyon → WhatsApp
const form = document.getElementById("res-form");
form.tarih.min = new Date().toLocaleDateString("sv-SE"); // yerel saatle YYYY-AA-GG
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const tarih = new Date(d.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
  const mesaj =
    `Merhaba, rezervasyon yapmak istiyorum.\n` +
    `Ad: ${d.ad}\nTarih: ${tarih}\nSaat: ${d.saat}\nKişi: ${d.kisi}` +
    (d.not ? `\nNot: ${d.not}` : "");
  window.open(waLink(mesaj), "_blank");
});

// Sabit WhatsApp butonu
document.getElementById("wa-float").href = waLink("Merhaba, bilgi almak istiyorum.");

// Kaydırınca beliren bölümler
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        observer.unobserve(en.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".section .container").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

document.getElementById("year").textContent = new Date().getFullYear();
