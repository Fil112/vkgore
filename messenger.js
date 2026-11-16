document.addEventListener("DOMContentLoaded", () => {
  const KEYS = {
    AUTH_ROLE: "vk_auth_role_v1",
    GUEST_NAME: "vk_guest_name_v1",
    AVATAR: "skalozub_custom_avatar_v1",
    THEME: "vk_theme_v1",
    BLACKLIST: "vk_blacklist_v1",
    GEMINI_KEY: "vk_gemini_api_key_v1",
    HISTORY: "vk_messenger_history_v1"
  };

  const GEMINI_PROXY_URL = "";
  const GEMINI_MODEL = "gemini-4-hydrogen";

  const AVATAR_FILES = {
    skalozub: "avatars/skalozub.jpg",
    famusov: "avatars/famusov.jpg",
    sofia: "avatars/sofia.jpg",
    liza: "avatars/liza.jpg",
    repetilov: "avatars/repetilov.jpg",
    khlestova: "avatars/khlestova.jpg",
    chatsky: "avatars/chatsky.jpg"
  };

  // Режим профиля
  let authRole = "guest";
  let guestName = "Гость";
  try {
    authRole = localStorage.getItem(KEYS.AUTH_ROLE) || "guest";
    guestName = localStorage.getItem(KEYS.GUEST_NAME) || "Гость";
  } catch (e) {}

  const isOwner = authRole === "skalozub";
  const headerUserName = document.getElementById("headerUserName");
  const headerMiniAvatar = document.getElementById("headerMiniAvatar");
  const switchAuthBtn = document.getElementById("switchAuthBtn");

  if (isOwner) {
    headerUserName.textContent = "Сергей Скалозуб";
    headerMiniAvatar.textContent = "СС";
    switchAuthBtn.textContent = "Выйти";
  } else {
    headerUserName.textContent = guestName;
    headerMiniAvatar.textContent = guestName.slice(0, 2).toUpperCase();
    headerMiniAvatar.style.backgroundColor = "#3a86ff";
    headerMiniAvatar.style.color = "#fff";
    switchAuthBtn.textContent = "Войти";
  }

  // Тёмная тема
  const themeBtn = document.getElementById("themeToggleBtn");
  function syncThemeBtn() {
    themeBtn.textContent = document.documentElement.classList.contains("dark-theme") ? "☀️" : "🌙";
  }
  syncThemeBtn();
  themeBtn.addEventListener("click", () => {
    document.documentElement.classList.add("theme-animating");
    const isDark = document.documentElement.classList.toggle("dark-theme");
    syncThemeBtn();
    try { localStorage.setItem(KEYS.THEME, isDark ? "dark" : "light"); } catch (e) {}
    setTimeout(() => document.documentElement.classList.remove("theme-animating"), 250);
  });

  // Подгрузка аватарок
  function applyAvatar(selector, url) {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.backgroundImage = `url(${url})`;
      el.classList.add("has-photo");
    });
  }

  let localSkalozubUrl = null;
  try {
    localSkalozubUrl = localStorage.getItem(KEYS.AVATAR);
    if (localSkalozubUrl) {
      applyAvatar(".av-skalozub", localSkalozubUrl);
      if (isOwner) applyAvatar("#headerMiniAvatar", localSkalozubUrl);
    }
  } catch (e) {}

  Object.entries(AVATAR_FILES).forEach(([key, src]) => {
    const img = new Image();
    img.onload = () => {
      if (key === "skalozub") {
        if (!localSkalozubUrl) {
          applyAvatar(".av-skalozub", src);
          if (isOwner) applyAvatar("#headerMiniAvatar", src);
        }
      } else {
        applyAvatar(`.av-${key}`, src);
      }
    };
    img.src = src;
  });

  // Персонажи
  const PERSONAS = {
    skalozub: {
      name: "Сергей Сергеевич Скалозуб",
      sub: "Полковник 45-го егерского полка",
      profileUrl: "index.html",
      greeting: "Здравия желаю! Пишите коротко и по существу — как в строю: раз, два!",
      prompt: "Ты — Сергей Сергеевич Скалозуб, полковник 45-го егерского полка из комедии А. С. Грибоедова «Горе от ума». Говори отрывисто, по-военному, гордись фрунтом, чинами и орденом за 3 августа, мечтай стать генералом, презирай книги, Вольтера и учёность. Отвечай живо, с юмором, в 1-3 предложениях."
    },
    famusov: {
      name: "Павел Афанасьевич Фамусов",
      sub: "Управляющий в казённом месте • Москва",
      profileUrl: "friends/famusov.html",
      greeting: "Милости просим! Заезжайте к нам в четверг на обед.",
      prompt: "Ты — Павел Афанасьевич Фамусов из «Горя от ума» Грибоедова. Ценишь чины, родственные связи, старые порядки и покойного дядю Максима Петровича, боишься мнения княгини Марьи Алексевны и хочешь сжечь все книги. Отвечай образно, в 1-3 предложениях."
    },
    sofia: {
      name: "Софья Павловна Фамусова",
      sub: "Дом Фамусовых • Москва",
      profileUrl: "friends/sofia.html",
      greeting: "Ах, здравствуйте. Прошу вас, только не о полковых учениях...",
      prompt: "Ты — Софья Павловна Фамусова из «Горя от ума» Грибоедова. Романтичная, начитанная девушка, любишь французские романы, тайно влюблена в Молчалина и вежливо отшиваешь разговоры о военной службе. Отвечай в 1-3 предложениях."
    },
    liza: {
      name: "Лизанька",
      sub: "Горничная в доме Фамусовых • Москва",
      profileUrl: "friends/liza.html",
      greeting: "Слушаю-с! Только потише, а то барин услышит.",
      prompt: "Ты — Лизанька, смышлёная и живая горничная из «Горя от ума» Грибоедова. Говоришь бойко, немного с лукавством, постоянно прикрываешь барышню Софью и переводишь часы. Отвечай в 1-3 предложениях."
    },
    repetilov: {
      name: "Репетилов",
      sub: "Английский клуб • Москва",
      profileUrl: "friends/repetilov.html",
      greeting: "Шумим, братец, шумим! Поехали к князь-Григорию!",
      prompt: "Ты — Репетилов из «Горя от ума» Грибоедова. Болтливый, суетливый, обожаешь тайные собрания у князь-Григория по четвергам и шампанское. Отвечай эмоционально, с восклицаниями, в 1-3 предложениях."
    },
    khlestova: {
      name: "Анфиса Ниловна Хлёстова",
      sub: "Свояченица Фамусова • Покровка",
      profileUrl: "friends/khlestova.html",
      greeting: "Ну что ещё надобно? Говори скорее, мне на Покровку ехать!",
      prompt: "Ты — Анфиса Ниловна Хлёстова, 65-летняя свояченица Фамусова из «Горя от ума». Строгая, прямолинейная, приехала с Покровки с собачкой моськой, ворчишь на молодёжь и не в восторге от Скалозуба. Отвечай в 1-3 предложениях."
    },
    chatsky: {
      name: "Александр Андреевич Чацкий",
      sub: "В разъездах • Москва",
      profileUrl: "friends/chatsky.html",
      greeting: "Ну, говорите! Опять будете защищать век минувший?",
      prompt: "Ты — Александр Андреевич Чацкий из «Горя от ума» Грибоедова. Остроумный, язвительный, образованный свободолюбец, критикуешь чинопочитание, мундиры и косность общества. Отвечай ярко и иронично, в 1-3 предложениях."
    }
  };

  let blacklistState = { chatsky: true };
  try {
    const savedBL = JSON.parse(localStorage.getItem(KEYS.BLACKLIST));
    if (savedBL && typeof savedBL === "object") blacklistState = savedBL;
  } catch (e) {}

  function createDefaultHistory() {
    const obj = {};
    Object.entries(PERSONAS).forEach(([id, p]) => {
      obj[id] = [{ role: "model", text: p.greeting }];
    });
    return obj;
  }

  let dialogHistory = createDefaultHistory();
  try {
    const savedHist = JSON.parse(localStorage.getItem(KEYS.HISTORY));
    if (savedHist && typeof savedHist === "object") {
      Object.keys(PERSONAS).forEach((id) => {
        if (Array.isArray(savedHist[id]) && savedHist[id].length > 0) {
          dialogHistory[id] = savedHist[id];
        }
      });
    }
  } catch (e) {}

  function saveHistory() {
    try { localStorage.setItem(KEYS.HISTORY, JSON.stringify(dialogHistory)); } catch (e) {}
  }

  // Превью в списке диалогов
  const skalozubPrev = document.getElementById("skalozubDialogPreview");
  if (isOwner) skalozubPrev.textContent = "🚫 Это ваш профиль";
  const chatskyPrev = document.getElementById("chatskyDialogPreview");
  if (isOwner && blacklistState.chatsky) chatskyPrev.textContent = "🚫 В чёрном списке";

  // Определяем открытый диалог из URL (?peer=...)
  const params = new URLSearchParams(window.location.search);
  let requestedPeer = params.get("peer");
  let currentPeer = (requestedPeer && PERSONAS[requestedPeer])
    ? requestedPeer
    : (isOwner ? "famusov" : "skalozub");

  // Настройки Gemini
  let geminiApiKey = "";
  try { geminiApiKey = localStorage.getItem(KEYS.GEMINI_KEY) || ""; } catch (e) {}
  const geminiStatusBadge = document.getElementById("geminiStatusBadge");
  const geminiSettingsPanel = document.getElementById("geminiSettingsPanel");
  const geminiKeyInput = document.getElementById("geminiKeyInput");

  function refreshGeminiBadge() {
    const active = Boolean(GEMINI_PROXY_URL || geminiApiKey);
    geminiStatusBadge.textContent = active ? "✨ Gemini AI" : "Локальный бот";
    geminiStatusBadge.classList.toggle("active", active);
    if (geminiApiKey) geminiKeyInput.value = geminiApiKey;
  }
  refreshGeminiBadge();

  document.getElementById("geminiSettingsBtn").addEventListener("click", () => geminiSettingsPanel.classList.toggle("hidden"));
  document.getElementById("saveGeminiKeyBtn").addEventListener("click", () => {
    const val = geminiKeyInput.value.trim();
    if (!val) return;
    geminiApiKey = val;
    try { localStorage.setItem(KEYS.GEMINI_KEY, val); } catch (e) {}
    refreshGeminiBadge();
    geminiSettingsPanel.classList.add("hidden");
  });
  document.getElementById("clearGeminiKeyBtn").addEventListener("click", () => {
    geminiApiKey = "";
    geminiKeyInput.value = "";
    try { localStorage.removeItem(KEYS.GEMINI_KEY); } catch (e) {}
    refreshGeminiBadge();
  });

  // Элементы чата
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatBlockedNotice = document.getElementById("chatBlockedNotice");
  const chatInputRow = document.getElementById("chatInputRow");

  function getBlockReason(peer) {
    // Главное правило: если ты не гость (т.е. Скалозуб), писать Скалозубу нельзя!
    if (peer === "skalozub" && !(!isOwner)) {
      return "🚫 Вы вошли как Сергей Скалозуб — писать самому себе нельзя. Выберите друга слева или войдите как Гость.";
    }
    if (isOwner && blacklistState[peer]) {
      return "🚫 Пользователь у вас в чёрном списке. Уберите его из ЧС во вкладке «Друзья», чтобы написать.";
    }
    return null;
  }

  function renderDialog() {
    const persona = PERSONAS[currentPeer];
    document.getElementById("chatPeerName").textContent = persona.name;
    document.getElementById("chatPeerSub").textContent = persona.sub;
    document.getElementById("openPeerProfileLink").href = persona.profileUrl;

    document.querySelectorAll(".dialog-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.peer === currentPeer);
    });

    chatMessages.innerHTML = "";
    dialogHistory[currentPeer].forEach((msg) => {
      const div = document.createElement("div");
      div.className = `chat-msg ${msg.role === "user" ? "outgoing" : "incoming"}`;
      div.textContent = msg.text;
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const blockReason = getBlockReason(currentPeer);
    if (blockReason) {
      chatBlockedNotice.textContent = blockReason;
      chatBlockedNotice.classList.remove("hidden");
      chatInputRow.classList.add("hidden");
    } else {
      chatBlockedNotice.classList.add("hidden");
      chatInputRow.classList.remove("hidden");
      chatInput.focus();
    }
  }

  document.getElementById("dialogList").addEventListener("click", (e) => {
    const btn = e.target.closest(".dialog-item");
    if (!btn) return;
    currentPeer = btn.dataset.peer;
    renderDialog();
  });

  document.getElementById("clearChatBtn").addEventListener("click", () => {
    dialogHistory[currentPeer] = [{ role: "model", text: PERSONAS[currentPeer].greeting }];
    saveHistory();
    renderDialog();
  });

  // Звук уведомления
  let audioCtx = null;
  function playNotifySound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const now = audioCtx.currentTime;
    [880, 1174.66].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.05, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.17);
    });
  }

  function localSmartReply(peer, text) {
    const t = text.toLowerCase();
    if (peer === "skalozub") {
      if (/книг|вольтер|уч[её]б|чита|школ|лиц/.test(t)) return "Учёностью меня не обморочишь! Книги сохранят так: для больших оказий, а я фельдфебеля в Вольтеры дам!";
      if (/генерал|чин|орден|служ|полк|арми/.test(t)) return "Я с восемьсот девятого служу, в сорок пятом егерском. Мне только бы досталось в генералы!";
      if (/жен|софь|невест|люб|свад/.test(t)) return "Жениться? Я ничуть не прочь! Павел Афанасьевич человек солидный.";
      if (/москв|пожар|город/.test(t)) return "Дистанции в Москве огромного размера, но пожар способствовал ей много к украшенью!";
      return "Говорите короче, по-военному: раз, два! В полку лишних речей не любят.";
    }
    if (peer === "famusov") {
      if (/софь|доч|жен/.test(t)) return "Для Софьюшки мне нужен человек солидный, при чинах! Вот Сергей Сергеич — другое дело.";
      if (/книг|чат|уч/.test(t)) return "Уж коли зло пресечь: забрать все книги бы да сжечь!";
      return "Ах, боже мой! Что станет говорить княгиня Марья Алексевна! Заезжайте лучше в четверг на обед.";
    }
    if (peer === "sofia") {
      if (/полк|арм|фрунт|скалозуб/.test(t)) return "Весело мне страх выслушивать о фрунте и рядах... Он совсем не моего романа.";
      if (/молчал|люб|сон/.test(t)) return "Молчалин — человек тихий, скромный. Счастливые часов не наблюдают!";
      return "Простите, я сейчас читаю французский роман и совсем не расположена к спорам.";
    }
    if (peer === "liza") {
      if (/час|бар|софь/.test(t)) return "Тсс! Я уже перевела часы, чтобы барин ничего не заподозрил!";
      return "Минуй нас пуще всех печалей и барский гнев, и барская любовь!";
    }
    if (peer === "repetilov") {
      if (/клуб|княз|шампан|собра/.test(t)) return "Поехали к князь-Григорию! Там человек сорок, шампанское на убой, секретнейший союз!";
      return "Шумим, братец, шумим! Мы такие умные вещи обсуждаем — сам иной раз диву даюсь!";
    }
    if (peer === "khlestova") {
      return "В шестьдесят пять лет меня учить вздумали! Подайте моську да карету мне заказывайте!";
    }
    if (peer === "chatsky") {
      if (/мундир|скалозуб|чин/.test(t)) return "А судьи кто?! Созвездие маневров и мазурки! Служить бы рад, прислуживаться тошно.";
      return "Свежо предание, а верится с трудом... Вон из Москвы! Карету мне, карету!";
    }
    return "Рад пообщаться!";
  }

  async function fetchGeminiReply(peer, history) {
    const endpoint = GEMINI_PROXY_URL
      ? GEMINI_PROXY_URL
      : `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const headers = { "Content-Type": "application/json" };
    if (!GEMINI_PROXY_URL) headers["x-goog-api-key"] = geminiApiKey;

    const roleNote = isOwner
      ? " Собеседник пишет тебе от лица Сергея Сергеевича Скалозуба."
      : ` Собеседник — гость по имени ${guestName}.`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PERSONAS[peer].prompt + roleNote }] },
        contents: history.slice(-10).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.9, maxOutputTokens: 280 }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const replyText = parts.filter((p) => !p.thought && p.text).map((p) => p.text).join("").trim();
    if (!replyText) throw new Error("Empty response");
    return replyText;
  }

  async function sendChatMessage() {
    if (getBlockReason(currentPeer)) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const peerAtSend = currentPeer;
    dialogHistory[peerAtSend].push({ role: "user", text });
    saveHistory();

    const out = document.createElement("div");
    out.className = "chat-msg outgoing";
    out.textContent = text;
    chatMessages.appendChild(out);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg incoming typing";
    typingEl.textContent = "печатает...";
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let replyText = "";
    if (GEMINI_PROXY_URL || geminiApiKey) {
      try {
        replyText = await fetchGeminiReply(peerAtSend, dialogHistory[peerAtSend]);
      } catch (err) {
        replyText = localSmartReply(peerAtSend, text);
      }
    } else {
      await new Promise((r) => setTimeout(r, 420));
      replyText = localSmartReply(peerAtSend, text);
    }

    dialogHistory[peerAtSend].push({ role: "model", text: replyText });
    saveHistory();

    if (currentPeer === peerAtSend) {
      typingEl.classList.remove("typing");
      typingEl.textContent = replyText;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    playNotifySound();
  }

  document.getElementById("sendChatBtn").addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendChatMessage(); });

  renderDialog();
});
