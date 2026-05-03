# ⚡ Typing Defender

> Düşen kelimeleri yazarak savunan hızlı klavye oyunu!

[![Live Demo](https://img.shields.io/badge/🎮%20Live%20Demo-almirakahraman.github.io-00d4ff?style=for-the-badge)](https://almirakahraman.github.io)

## 🕹️ Canlı Demo

👉 **[almirakahraman.github.io](https://almirakahraman.github.io)**

---

## 📖 Oyun Hakkında

**Typing Defender**, ekrandan düşen kelimeleri klavyeyle yazarak yok etmeye çalıştığın bir hız ve doğruluk oyunudur. Seviye yükseldikçe kelimeler hızlanır, zorlaşır!

---

## 🎯 Nasıl Oynanır?

1. **▶ Başlat** butonuna tıkla
2. Ekrandan düşen kelimeleri input alanına yaz
3. `Enter` veya `Space` ile gönder — ya da tam kelime yazılınca otomatik silinir
4. Kelimeler alta değmeden bitir, canlarını koru!

---

## ✨ Özellikler

| Özellik | Detay |
|---|---|
| 🎯 Kelime havuzu | 100+ Türkçe + İngilizce kelime |
| ❤️ Can sistemi | 3 can — alt sınıra değen kelime can düşürür |
| ⬆️ Otomatik seviye atlama | Her seviyede kelimeler hızlanır |
| 💥 Efektler | Patlama partikülleri, skor popup, arena kırmızı flash |
| 🟡 Partial eşleşme | Yazarken eşleşen kelimeler sarıya döner |
| ⏸ Kontroller | Başlat / Duraklat / Yeniden başlat |
| 🎨 Neon dark mode | Orbitron font, scanline efekti, glassmorphism |

---

## 🗂️ Proje Yapısı

```
typing-defender/
├── index.html   # Ana HTML yapısı
├── style.css    # Tüm stiller (neon dark theme)
├── game.js      # Oyun mantığı (loop, spawn, scoring)
└── README.md    # Bu dosya
```

---

## 🛠️ Teknolojiler

- **HTML5** – Semantik yapı
- **CSS3** – Animasyonlar, CSS değişkenleri, glassmorphism
- **Vanilla JavaScript** – `requestAnimationFrame` tabanlı oyun döngüsü
- **Google Fonts** – Orbitron & Inter

---

## 🔧 Kurulum

Herhangi bir kurulum gerektirmez! Sadece `index.html` dosyasını tarayıcında aç:

```bash
# Yerel olarak açmak için:
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 🎮 Konsol Hileleri (Dev Modu)

Tarayıcı konsoluna (`F12`) yapıştırarak oyunu hackleyebilirsin:

```js
// Ekrandaki kelimeleri gör
wordsOnScreen.map(w => w.word)

// Tab ile otomatik tamamlama
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    if (wordsOnScreen.length > 0) {
      wordInput.value = wordsOnScreen[0].word;
      wordInput.dispatchEvent(new Event('input'));
    }
  }
});

// Sonsuz can
lives = 99; updateHUD();
```

---

## 👤 Geliştirici

**Almir Akahraman**
- GitHub: [@almirakahraman](https://github.com/almirakahraman)
- Site: [almirakahraman.github.io](https://almirakahraman.github.io)

---

## 📄 Lisans

MIT License © 2024 Almir Akahraman
