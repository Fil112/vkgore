document.addEventListener("DOMContentLoaded", () => {
  const AVATAR_STORAGE_KEY = "skalozub_custom_avatar_v1";
  const THEME_KEY = "vk_theme_v1";
  const GEMINI_KEY = "vk_gemini_api_key_v1";
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

  // Синхронизация Тёмной темы и добавление кнопки 🌙 в шапку
  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = isDark ? "☀️" : "🌙";
  }

  const headerRight = document.querySelector(".vk-header-right");
  if (headerRight && !document.getElementById("themeToggleBtn")) {
    const btn = document.createElement("button");
    btn.id = "themeToggleBtn";
    btn.className = "theme-toggle-btn";
    btn.title = "Переключить тему";
    btn.addEventListener("click", () => {
      const next = document.body.classList.contains("dark-theme") ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
    headerRight.prepend(btn);
  }

  try {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
  } catch (e) {}

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
    const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (saved) {
      localSkalozubUrl = saved;
      applyPhoto(".av-skalozub, .vk-avatar-mini", saved);
    }
  } catch (err) {}

  Object.entries(AVATAR_FILES).forEach(([key, src]) => {
    const img = new Image();
    img.onload = () => {
      if (key === "skalozub") {
        baseSkalozubUrl = src;
        if (!localSkalozubUrl) applyPhoto(".av-skalozub, .vk-avatar-mini", src);
      } else {
        applyPhoto(`.av-${key}`, src);
      }
    };
    img.src = src;
  });

  // Подробная информация
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
      if (focusBtn) {
        focusBtn.closest(".post-card").querySelector(".comment-input").focus();
      }

      const sendBtn = e.target.closest(".send-comment-btn");
      if (sendBtn) {
        const postCard = sendBtn.closest(".post-card");
        addComment(postCard, postCard.querySelector(".comment-input"));
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
    commentEl.innerHTML = `
      <div class="comment-avatar av-skalozub">СС</div>
      <div class="comment-body">
        <span class="comment-author">Сергей Сергеевич Скалозуб</span>
        <span class="comment-text"></span>
        <div class="comment-date">только что</div>
      </div>
    `;
    commentEl.querySelector(".comment-text").textContent = text;

    const activeUrl = localSkalozubUrl || baseSkalozubUrl;
    if (activeUrl) {
      const av = commentEl.querySelector(".comment-avatar");
      av.style.backgroundImage = `url(${activeUrl})`;
      av.classList.add("has-photo");
    }

    list.appendChild(commentEl);
    input.value = "";
  }

  // Чат с персонажем (использует Gemini, если ключ введён на главной)
  const chatModal = document.getElementById("chatModal");
  const openChatBtn = document.getElementById("openChatBtn");
  const openChatSidebar = document.getElementById("openChatSidebar");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  let replies = ["Рад пообщаться!"];
  try {
    if (document.body.dataset.replies) {
      replies = JSON.parse(document.body.dataset.replies);
    }
  } catch (err) {}

  const characterName = document.querySelector("h1")?.textContent || "Герой Грибоедова";
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

    let apiKey = "";
    try {
      apiKey = localStorage.getItem(GEMINI_KEY) || "";
    } catch (e) {}

    let replyText = "";
    if (GEMINI_PROXY_URL || apiKey) {
      try {
        const endpoint = GEMINI_PROXY_URL
          ? GEMINI_PROXY_URL
          : `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
        const headers = { "Content-Type": "application/json" };
        if (!GEMINI_PROXY_URL) headers["x-goog-api-key"] = apiKey;

        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: `Ты — ${characterName} из комедии А. С. Грибоедова «Горе от ума». Отвечай в характере своего персонажа, ярко и коротко (1-3 предложения).` }]
            },
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