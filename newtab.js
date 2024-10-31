document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("focus-input");
  const placeholder = input.placeholder;
  const helperSpan = document.getElementById("text-width-helper");
  const overlay = document.getElementById("overlay");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>`;
  const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>
`;

  const focusText = chrome.i18n.getMessage("focusText");

  document.querySelector(".focus-text").textContent = focusText;

  // Recupera l'obiettivo salvato quando la pagina viene caricata
  chrome.storage.sync.get(["dailyFocus", "darkMode"], (data) => {
    if (data.dailyFocus) {
      input.value = data.dailyFocus;
      updateInputWidth(); // Aggiorna la larghezza se c'è testo salvato
    }

    // Controlla se il tema scuro è attivo e applica la classe
    if (data.darkMode) {
      document.body.classList.add("dark-mode");
    }
    updateThemeIcon();
  });

  // Eventi per mostrare e nascondere l'overlay
  input.addEventListener("focus", () => {
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";
    input.classList.add("active-input"); // Aggiungi la classe per lo sfondo bianco
    input.placeholder = ""; // Rimuovi il placeholder
  });

  input.addEventListener("blur", () => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    input.classList.remove("active-input"); // Rimuovi la classe per tornare allo sfondo trasparente
    input.placeholder = placeholder; // Ripristina il placeholder
  });

  // Salva l'obiettivo quando l'utente preme Invio o lascia il campo
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveFocus();
      input.blur(); // Rimuove il focus dall'input
    }
  });

  input.addEventListener("focusout", saveFocus);

  // Aggiorna la larghezza dell'input al cambiare del contenuto
  input.addEventListener("input", updateInputWidth);

  function saveFocus() {
    chrome.storage.sync.set({ dailyFocus: input.value });
  }

  function updateInputWidth() {
    helperSpan.textContent = input.value || placeholder; // Copia il testo dell'input nello span
    input.style.width = helperSpan.offsetWidth + "px"; // Adatta la larghezza dell'input
  }

  function updateThemeIcon() {
    // Aggiorna le icone
    if (document.body.classList.contains("dark-mode")) {
      themeIcon.innerHTML = moonSVG;
    } else {
      themeIcon.innerHTML = sunSVG;
    }
  }

  // Gestisci il cambio tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode"); // Cambia il tema

    // Aggiorna le icone
    updateThemeIcon();

    // Salva lo stato del tema nel Chrome Sync Storage
    const darkModeEnabled = document.body.classList.contains("dark-mode");
    chrome.storage.sync.set({ darkMode: darkModeEnabled });
  });
});
