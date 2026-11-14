document.addEventListener("DOMContentLoaded", () => {
  const KEYS = {
    AUTH_ROLE: "vk_auth_role_v1",
    GUEST_NAME: "vk_guest_name_v1",
    AVATAR: "skalozub_custom_avatar_v1",
    THEME: "vk_theme_v1",
    GEMINI_KEY: "vk_gemini_api_key_v1"
  };

  const GEMINI_PROXY_URL = "";
  const GEMINI_MODEL = "gemini-3.8-flash";

  const AVATAR_FILES = {
    skalozub: "../avatars/skalozub.jpg",
    famusov: "../avatars/famusov.jpg",
    sofia: "../avatars/sofia.jpg",
    liza: "../avatars/liza.jpg",
    repetilov: "../avatars/repetilov.jpg",
    khlestova: "../avatars/khlestova.jpg",
    chatsky: "../avatars/chatsky.jpg"
  };

  const PERSONA_PROMPTS = {
    "famusov.html": "Ты — Павел Афанасьевич Фамусов из «Горя от ума» Грибоедова. Важный московский барин, ценишь чины, связи и старые порядки, боишься мнения княгини Марьи Алексевны и хочешь сжечь все книги. Отвечай живо в 1-3 предложениях.",
    "sofia.html": "Ты — Софья Павловна Фамусова из «Горя от ума». Романтичная, начитанная, любишь французские романы и Молчалина, устала от разговоров о полковниках и учениях. Отвечай в 1-3 предложениях.",
    "liza.html": "Ты — Лизанька, смышлёная горничная в доме Фамусовых из «Горя от ума». Говоришь живо, с лукавством, устала переводить часы и прикрывать барышню. Отвечай в 1-3 предложениях.",
    "repetilov.html": "Ты — Репетилов из «Горя от ума». Болтливый, восторженный, зовёшь всех в Английский клуб и на тайные собрания по четвергам к князь-Григорию. Отвечай эмоционально в 1-3 предложениях.",
    "khlestova.html": "Ты — Анфиса Ниловна Хлёстова, 65-летняя свояченица Фамусова. Строгая, прямолинейная, приехала с Покровки со своей собачкой моськой, ворчишь на молодёжь и Чацкого. Отвечай в 1-3 предложениях.",
    "chatsky.html": "Ты — Александр Андреевич Чацкий из «Горя от ума». Остроумный, язвительный свободолюбец («служить бы рад, прислуживаться тошно»), критикуешь чинопочитание, мундиры и косность общества. Отвечай ярко в 1-3 предложениях."
  };

  // Режим профиля (Скалозуб / Гость)
  let authRole = "guest";
  let guestName = "Гость";
  try {
    authRole = localStorage.getItem(KEYS.AUTH_ROLE) || "guest";
    guestName = localStorage.getItem(KEYS.GUEST_NAME) || "Гость";
  } catch (e) {}
  const isOwner = authRole === "skalozub";

  const headerRight = document.querySelector(".vk-header-right");
  const headerName = document.querySelector(".vk-user-mini");
  const headerAv = document.querySelector(".vk-avatar-mini");

  if (headerName && headerAv) {
    if (isOwner) {
      headerName.textContent = "Сергей Скалозуб";
      headerAv.textContent = "СС";
    } else {
      headerName.textContent = guestName;
      headerAv.textContent = guestName.slice(0, 2).toUpperCase();
      headerAv.style.backgroundColor = "#3a86ff";
      headerAv.style.color = "#fff";
    }
  }

  if (headerRight) {
    if (!document.getElementById("themeToggleBtn")) {
      const tBtn = document.createElement("button");
      tBtn.id = "themeToggleBtn";
      tBtn.className = "theme-toggle-btn";
      tBtn.title = "Переключить тему";
      tBtn.textContent = document.documentElement.classList.contains("dark-theme") ? "☀️" : "🌙";
      tBtn.addEventListener("click", () => {
        document.documentElement.classList.add("theme-animating");
        const isDark = document.documentElement.classList.toggle("dark-theme");
        tBtn.textContent = isDark ? "☀️" : "🌙";
        try { localStorage.setItem(KEYS.THEME, isDark ? "dark" : "light"); } catch (e) {}
        setTimeout(() => document.documentElement.classList.remove("theme-animating"), 250);
      });
      headerRight.prepend(tBtn);
    }

    if (!document.getElementById("switchAuthBtn")) {
      const authLink = document.createElement("a");
      authLink.id = "switchAuthBtn";
      authLink.href = "../login.html";
      authLink.className = "btn btn-secondary btn-sm";
      authLink.textContent = isOwner ? "Выйти" : "Войти";
      headerRight.appendChild(authLink);
    }
  }

  // Подгрузка аватарок из ../avatars/
  let baseSkalozubUrl = null;
  let localSkalozubUrl = null;

  function applyPhoto(selector, url) {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.backgroundImage = `url(${url})`;
      el.classList.add("has-photo");
    });
  }

  try {
    const saved = localStorage.getItem(KEYS.AVATAR);
    if (saved) {
      localSkalozubUrl = saved;
      applyPhoto(".av-skalozub", saved);
      if (isOwner) applyPhoto(".vk-avatar-mini", saved);
    }
  } catch (err) {}

  Object.entries(AVATAR_FILES).forEach(([key, src]) => {
    const img = new Image();
    img.onload = () => {
      if (key === "skalozub") {
        baseSkalozubUrl = src;
        if (!localSkalozubUrl) {
          applyPhoto(".av-skalozub", src);
          if (isOwner) applyPhoto(".vk-avatar-mini", src);
        }
      } else {
        applyPhoto(`.av-${key}`, src);
      }
    };
    img.src = src;
  });

  // Подробнее
  const toggleDetailsBtn = document.getElementById("toggleDetailsBtn");
  const profileDetails = document.getElementById("profileDetails");
  if (toggleDetailsBtn && profileDetails) {
    toggleDetailsBtn.addEventListener("click", () => {
      const isHidden = profileDetails.classList.toggle("hidden");
      toggleDetailsBtn.textContent = isHidden ? "Подробнее ▾" : "Скрыть ▴";
    });
  }

  // Лайки и комментарии
  const postsContainer = document.getElementById("postsContainer");
  if (postsContainer) {
    postsContainer.addEventListener("click", (e) => {
      const likeBtn = e.target.closest(".like-btn");
      if (likeBtn) {
        let count = parseInt(likeBtn.dataset.count, 10);
        const isLiked = likeBtn.classList.toggle("liked");
        count = isLiked ? count + 1 : count - 1;
        likeBtn.dataset.count = count;
        likeBtn.querySelector(".count").textContent = count;
      }
      const focusBtn = e.target.closest(".comment-focus-btn");
      if (focusBtn) focusBtn.closest(".post-card").querySelector(".comment-input").focus();
      const sendBtn = e.target.closest(".send-comment-btn");
      if (sendBtn) {
        const card = sendBtn.closest(".post-card");
        addComment(card, card.querySelector(".comment-input"));
      }
    });

    postsContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.classList.contains("comment-input")) {
        addComment(e.target.closest(".post-card"), e.target);
      }
    });
  }

  function addComment(postCard, input) {
    const text = input.value.trim();
    if (!text) return;

    const list = postCard.querySelector(".comments-list");
    const commentEl = document.createElement("div");
    commentEl.className = "comment";
    const authorName = isOwner ? "Сергей Сергеевич Скалозуб" : guestName;
    const initials = isOwner ? "СС" : guestName.slice(0, 2).toUpperCase();

    commentEl.innerHTML = `
      <div class="comment-avatar ${isOwner ? "av-skalozub" : "av-sofia"}"></div>
      <div class="comment-body">
        <span class="comment-author"></span>
        <span class="comment-text"></span>
        <div class="comment-date">только что</div>
      </div>
    `;
    const av = commentEl.querySelector(".comment-avatar");
    av.textContent = initials;
    commentEl.querySelector(".comment-author").textContent = authorName;
    commentEl.querySelector(".comment-text").textContent = text;

    if (isOwner) {
      const activeUrl = localSkalozubUrl || baseSkalozubUrl;
      if (activeUrl) {
        av.style.backgroundImage = `url(${activeUrl})`;
        av.classList.add("has-photo");
      }
    }

    list.appendChild(commentEl);
    input.value = "";
  }

  // Чат с персонажем + встроенная настройка Gemini
  const chatModal = document.getElementById("chatModal");
  const openChatBtn = document.getElementById("openChatBtn");
  const openChatSidebar = document.getElementById("openChatSidebar");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  let geminiApiKey = "";
  try { geminiApiKey = localStorage.getItem(KEYS.GEMINI_KEY) || ""; } catch (e) {}

  // Добавляем бейдж и панель настройки Gemini прямо в модалку мини-профиля
  const modalHeader = chatModal?.querySelector(".modal-header");
  let statusBadge = null;
  if (modalHeader && closeChatBtn) {
    const controls = document.createElement("div");
    controls.className = "messenger-header-actions";
    controls.innerHTML = `
      <span class="gemini-badge" id="miniGeminiBadge">Локальный бот</span>
      <button class="btn btn-secondary btn-sm" id="miniGeminiBtn" type="button">⚙️ ИИ</button>
    `;
    controls.appendChild(closeChatBtn);
    modalHeader.appendChild(controls);
    statusBadge = controls.querySelector("#miniGeminiBadge");

    const panel = document.createElement("div");
    panel.className = "gemini-panel hidden";
    panel.innerHTML = `
      <div class="gemini-panel-title">Подключение Gemini (gemini-3.8-flash)</div>
      <div class="gemini-input-row">
        <input type="password" id="miniGeminiInput" placeholder="Gemini API Key (AIza...)" />
        <button class="btn btn-primary btn-sm" id="miniSaveKey" type="button">Сохранить</button>
      </div>
    `;
    modalHeader.after(panel);

    const refreshBadge = () => {
      const active = Boolean(GEMINI_PROXY_URL || geminiApiKey);
      statusBadge.textContent = active ? "✨ Gemini AI" : "Локальный бот";
      statusBadge.classList.toggle("active", active);
      if (geminiApiKey) panel.querySelector("#miniGeminiInput").value = geminiApiKey;
    };
    refreshBadge();

    controls.querySelector("#miniGeminiBtn").addEventListener("click", () => panel.classList.toggle("hidden"));
    panel.querySelector("#miniSaveKey").addEventListener("click", () => {
      const val = panel.querySelector("#miniGeminiInput").value.trim();
      geminiApiKey = val;
      try {
        if (val) localStorage.setItem(KEYS.GEMINI_KEY, val);
        else localStorage.removeItem(KEYS.GEMINI_KEY);
      } catch (e) {}
      refreshBadge();
      panel.classList.add("hidden");
    });
  }

  let replies = ["Рад пообщаться!"];
  try {
    if (document.body.dataset.replies) replies = JSON.parse(document.body.dataset.replies);
  } catch (err) {}

  const fileName = window.location.pathname.split("/").pop() || "";
  const characterName = document.querySelector("h1")?.textContent || "Герой Грибоедова";
  const basePrompt = PERSONA_PROMPTS[fileName] || `Ты — ${characterName} из комедии А. С. Грибоедова «Горе от ума». Отвечай в характере персонажа в 1-3 предложениях.`;
  const history = [];

  function openChat(e) {
    if (e) e.preventDefault();
    chatModal.classList.remove("hidden");
    chatInput.focus();
  }

  if (openChatBtn) openChatBtn.addEventListener("click", openChat);
  if (openChatSidebar) openChatSidebar.addEventListener("click", openChat);
  if (closeChatBtn) closeChatBtn.addEventListener("click", () => chatModal.classList.add("hidden"));
  if (chatModal) {
    chatModal.addEventListener("click", (e) => {
      if (e.target === chatModal) chatModal.classList.add("hidden");
    });
  }

  async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    history.push({ role: "user", text });
    const out = document.createElement("div");
    out.className = "chat-msg outgoing";
    out.textContent = text;
    chatMessages.appendChild(out);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typing = document.createElement("div");
    typing.className = "chat-msg incoming typing";
    typing.textContent = "печатает...";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let replyText = "";
    if (GEMINI_PROXY_URL || geminiApiKey) {
      try {
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
            system_instruction: { parts: [{ text: basePrompt + roleNote }] },
            contents: history.slice(-8).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
            generationConfig: { temperature: 0.9, maxOutputTokens: 240 }
          })
        });
        const data = await res.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        replyText = parts.filter((p) => !p.thought && p.text).map((p) => p.text).join("").trim();
      } catch (err) {}
    }

    if (!replyText) {
      await new Promise((r) => setTimeout(r, 400));
      replyText = replies[Math.floor(Math.random() * replies.length)];
    }

    history.push({ role: "model", text: replyText });
    typing.classList.remove("typing");
    typing.textContent = replyText;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (sendChatBtn) sendChatBtn.addEventListener("click", sendChatMessage);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendChatMessage();
    });
  }
});
