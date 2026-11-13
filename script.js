document.addEventListener("DOMContentLoaded", () => {
  // Ключи localStorage
  const KEYS = {
    AVATAR: "skalozub_custom_avatar_v1",
    THEME: "vk_theme_v1",
    STATUS: "vk_status_v1",
    LIKES: "vk_likes_v1",
    COMMENTS: "vk_comments_v1",
    POSTS: "vk_custom_posts_v1",
    POLL: "vk_poll_v1",
    BLACKLIST: "vk_blacklist_v1",
    GEMINI_KEY: "vk_gemini_api_key_v1"
  };

  // (Опционально) Если поднимешь свой Cloudflare Worker прокси — вставь его URL сюда,
  // чтобы Gemini работал у всех гостей без ввода ключа:
  const GEMINI_PROXY_URL = "";
  const GEMINI_MODEL = "gemini-3.5-flash-lite";

  const AVATAR_FILES = {
    skalozub: "avatars/skalozub.jpg",
    famusov: "avatars/famusov.jpg",
    sofia: "avatars/sofia.jpg",
    liza: "avatars/liza.jpg",
    repetilov: "avatars/repetilov.jpg",
    khlestova: "avatars/khlestova.jpg",
    chatsky: "avatars/chatsky.jpg"
  };

  // ==================== 1. ТЁМНАЯ ТЕМА ====================
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  }

  try {
    applyTheme(localStorage.getItem(KEYS.THEME) || "light");
  } catch (e) {}

  themeToggleBtn.addEventListener("click", () => {
    const next = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(KEYS.THEME, next);
    } catch (e) {}
  });

  // ==================== 2. АВАТАРКИ (база avatars/ + кнопка 📷) ====================
  const avatarUploadInput = document.getElementById("avatarUploadInput");
  const defaultAvatarSvg = document.getElementById("defaultAvatarSvg");
  const customAvatarImg = document.getElementById("customAvatarImg");
  const resetAvatarBtn = document.getElementById("resetAvatarBtn");
  const headerMiniAvatar = document.getElementById("headerMiniAvatar");

  let baseSkalozubUrl = null;
  let localSkalozubUrl = null;

  function getActiveSkalozubUrl() {
    return localSkalozubUrl || baseSkalozubUrl;
  }

  function applyAvatarToElements(selector, url) {
    document.querySelectorAll(selector).forEach((el) => {
      if (url) {
        el.style.backgroundImage = `url(${url})`;
        el.classList.add("has-photo");
      } else {
        el.style.backgroundImage = "";
        el.classList.remove("has-photo");
      }
    });
  }

  function renderSkalozubAvatar(url, isLocalOverride = false) {
    if (url) {
      customAvatarImg.src = url;
      customAvatarImg.classList.remove("hidden");
      defaultAvatarSvg.classList.add("hidden");
      resetAvatarBtn.classList.toggle("hidden", !isLocalOverride);
      headerMiniAvatar.style.backgroundImage = `url(${url})`;
      headerMiniAvatar.classList.add("has-photo");
      applyAvatarToElements(".av-skalozub", url);
    } else {
      customAvatarImg.removeAttribute("src");
      customAvatarImg.classList.add("hidden");
      defaultAvatarSvg.classList.remove("hidden");
      resetAvatarBtn.classList.add("hidden");
      headerMiniAvatar.style.backgroundImage = "";
      headerMiniAvatar.classList.remove("has-photo");
      applyAvatarToElements(".av-skalozub", null);
    }
  }

  try {
    const savedAvatar = localStorage.getItem(KEYS.AVATAR);
    if (savedAvatar) {
      localSkalozubUrl = savedAvatar;
      renderSkalozubAvatar(savedAvatar, true);
    }
  } catch (e) {}

  Object.entries(AVATAR_FILES).forEach(([key, src]) => {
    const testImg = new Image();
    testImg.onload = () => {
      if (key === "skalozub") {
        baseSkalozubUrl = src;
        if (!localSkalozubUrl) renderSkalozubAvatar(src, false);
      } else {
        applyAvatarToElements(`.av-${key}`, src);
      }
    };
    testImg.src = src;
  });

  avatarUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - minSide) / 2,
          (img.height - minSide) / 2,
          minSide,
          minSide,
          0,
          0,
          size,
          size
        );
        const compressedUrl = canvas.toDataURL("image/jpeg", 0.85);
        localSkalozubUrl = compressedUrl;
        renderSkalozubAvatar(compressedUrl, true);
        try {
          localStorage.setItem(KEYS.AVATAR, compressedUrl);
        } catch (err) {}
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    avatarUploadInput.value = "";
  });

  resetAvatarBtn.addEventListener("click", () => {
    localSkalozubUrl = null;
    try {
      localStorage.removeItem(KEYS.AVATAR);
    } catch (e) {}
    renderSkalozubAvatar(baseSkalozubUrl, false);
  });

  // ==================== 3. СМЕНА СТАТУСА ПО КЛИКУ ====================
  const profileStatus = document.getElementById("profileStatus");
  const statusEditor = document.getElementById("statusEditor");
  const statusSelect = document.getElementById("statusSelect");
  const statusCustomInput = document.getElementById("statusCustomInput");

  try {
    const savedStatus = localStorage.getItem(KEYS.STATUS);
    if (savedStatus) profileStatus.textContent = savedStatus;
  } catch (e) {}

  profileStatus.addEventListener("click", () => {
    statusEditor.classList.toggle("hidden");
    statusCustomInput.value = "";
  });

  document.getElementById("cancelStatusBtn").addEventListener("click", () => {
    statusEditor.classList.add("hidden");
  });

  document.getElementById("saveStatusBtn").addEventListener("click", () => {
    const custom = statusCustomInput.value.trim();
    const chosen = custom || statusSelect.value;
    profileStatus.textContent = chosen;
    statusEditor.classList.add("hidden");
    try {
      localStorage.setItem(KEYS.STATUS, chosen);
    } catch (e) {}
  });

  // ==================== 4. ФОТОГРАФИИ И ЛАЙТБОКС ====================
  const photoCaptions = [
    "Москва после 1812 года: «Пожар способствовал ей много к украшенью!»",
    "Учения 45-го егерского полка: «Раз, два! Вот и вся наука».",
    "Бал у Фамусовых: мазурка и светские беседы.",
    "Родной брат в деревне: «Службу оставил, книги стал читать...»"
  ];
  const photoThumbs = document.querySelectorAll(".photo-thumb");
  const photoLightbox = document.getElementById("photoLightbox");
  const lightboxImgWrap = document.getElementById("lightboxImgWrap");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let currentPhotoIdx = 0;

  function openLightbox(idx) {
    currentPhotoIdx = (idx + photoThumbs.length) % photoThumbs.length;
    const svgClone = photoThumbs[currentPhotoIdx].querySelector("svg").cloneNode(true);
    lightboxImgWrap.innerHTML = "";
    lightboxImgWrap.appendChild(svgClone);
    lightboxCaption.textContent = photoCaptions[currentPhotoIdx];
    photoLightbox.classList.remove("hidden");
  }

  photoThumbs.forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(parseInt(btn.dataset.index, 10)));
  });

  document.getElementById("lightboxPrev").addEventListener("click", () => openLightbox(currentPhotoIdx - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => openLightbox(currentPhotoIdx + 1));
  document.getElementById("lightboxClose").addEventListener("click", () => photoLightbox.classList.add("hidden"));
  photoLightbox.addEventListener("click", (e) => {
    if (e.target === photoLightbox) photoLightbox.classList.add("hidden");
  });

  // ==================== 5. ОПРОС НА СТЕНЕ ====================
  const basePollCounts = [22, 16, 10];
  let userPollVote = null;
  try {
    const savedVote = localStorage.getItem(KEYS.POLL);
    if (savedVote !== null) userPollVote = parseInt(savedVote, 10);
  } catch (e) {}

  function renderPoll() {
    const counts = [...basePollCounts];
    if (userPollVote !== null && counts[userPollVote] !== undefined) {
      counts[userPollVote] += 1;
    }
    const total = counts.reduce((a, b) => a + b, 0);

    document.querySelectorAll(".poll-option").forEach((btn, idx) => {
      const pct = Math.round((counts[idx] / total) * 100);
      btn.classList.toggle("selected", userPollVote === idx);
      btn.querySelector(".poll-fill").style.width = userPollVote !== null ? `${pct}%` : "0%";
      btn.querySelector(".poll-percent").textContent = userPollVote !== null ? `${pct}%` : "";
    });
    document.getElementById("pollTotal").textContent = `Проголосовало: ${total} чел.`;
  }

  document.getElementById("pollBox").addEventListener("click", (e) => {
    const opt = e.target.closest(".poll-option");
    if (!opt) return;
    userPollVote = parseInt(opt.dataset.option, 10);
    try {
      localStorage.setItem(KEYS.POLL, String(userPollVote));
    } catch (err) {}
    renderPoll();
  });
  renderPoll();

  // ==================== 6. ВКЛАДКИ И АНИМАЦИЯ НОВОСТЕЙ ====================
  const profileView = document.getElementById("profileView");
  const friendsView = document.getElementById("friendsView");
  const navItems = document.querySelectorAll(".vk-nav-item");
  const navProfile = document.getElementById("navProfile");
  const navNews = document.getElementById("navNews");
  const navFriends = document.getElementById("navFriends");
  const wallSection = document.getElementById("wall");

  function setActiveNav(target) {
    navItems.forEach((item) => item.classList.remove("active"));
    target.classList.add("active");
  }

  function showView(view) {
    if (view === "friends") {
      profileView.classList.add("hidden");
      friendsView.classList.remove("hidden", "view-animate");
      void friendsView.offsetWidth;
      friendsView.classList.add("view-animate");
      setActiveNav(navFriends);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      friendsView.classList.add("hidden");
      profileView.classList.remove("hidden");
    }
  }

  function triggerNewsAnimation() {
    document.querySelectorAll("#postsContainer .post-card").forEach((post, index) => {
      post.classList.remove("news-animate");
      post.style.animationDelay = `${index * 90}ms`;
      void post.offsetWidth;
      post.classList.add("news-animate");
    });
  }

  navProfile.addEventListener("click", (e) => {
    e.preventDefault();
    showView("profile");
    setActiveNav(navProfile);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("logoHome").addEventListener("click", (e) => {
    e.preventDefault();
    showView("profile");
    setActiveNav(navProfile);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navNews.addEventListener("click", (e) => {
    e.preventDefault();
    showView("profile");
    setActiveNav(navNews);
    wallSection.scrollIntoView({ behavior: "smooth", block: "start" });
    triggerNewsAnimation();
  });

  navFriends.addEventListener("click", (e) => {
    e.preventDefault();
    showView("friends");
  });

  document.getElementById("openFriendsFromSide").addEventListener("click", () => showView("friends"));
  document.getElementById("backToProfileBtn").addEventListener("click", () => {
    showView("profile");
    setActiveNav(navProfile);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (window.location.hash === "#friends-tab") {
    showView("friends");
  } else if (window.location.hash === "#wall") {
    setActiveNav(navNews);
    triggerNewsAnimation();
  }

  // ==================== 7. ДРУЗЬЯ И ЧЁРНЫЙ СПИСОК ====================
  const friendTabBtns = document.querySelectorAll(".friends-tab-btn");
  const friendsFilterInput = document.getElementById("friendsFilterInput");
  const friendPageCards = document.querySelectorAll(".friend-page-card");
  let currentFriendFilter = "all";

  let blacklistState = { chatsky: true };
  try {
    const savedBL = JSON.parse(localStorage.getItem(KEYS.BLACKLIST));
    if (savedBL && typeof savedBL === "object") blacklistState = savedBL;
  } catch (e) {}

  function syncBlacklistUI() {
    let allCount = 0;
    let onlineCount = 0;
    let blCount = 0;

    friendPageCards.forEach((card) => {
      const id = card.dataset.friendId;
      const isOnline = card.dataset.online === "true";
      const isBL = Boolean(blacklistState[id]);
      card.dataset.blacklist = String(isBL);

      card.querySelector(".cs-badge").classList.toggle("hidden", !isBL);
      card.querySelector(".toggle-cs-btn").textContent = isBL ? "Убрать из ЧС" : "В ЧС";

      if (isBL) {
        blCount++;
      } else {
        allCount++;
        if (isOnline) onlineCount++;
      }
    });

    document.getElementById("countAll").textContent = allCount;
    document.getElementById("countOnline").textContent = onlineCount;
    document.getElementById("countBlacklist").textContent = blCount;
    document.getElementById("navFriendsBadge").textContent = allCount + blCount;

    const chatskyPrev = document.getElementById("chatskyDialogPreview");
    if (chatskyPrev) {
      chatskyPrev.textContent = blacklistState.chatsky
        ? "🚫 В чёрном списке"
        : "А судьи кто?!";
    }
    applyFriendsFilter();
  }

  function applyFriendsFilter() {
    const query = friendsFilterInput.value.trim().toLowerCase();
    friendPageCards.forEach((card) => {
      const isOnline = card.dataset.online === "true";
      const isBL = card.dataset.blacklist === "true";
      const text = card.textContent.toLowerCase();

      let matchesTab = false;
      if (currentFriendFilter === "all") matchesTab = !isBL;
      if (currentFriendFilter === "online") matchesTab = isOnline && !isBL;
      if (currentFriendFilter === "blacklist") matchesTab = isBL;

      card.classList.toggle("hidden", !(matchesTab && (!query || text.includes(query))));
    });
  }

  document.getElementById("friendsPageList").addEventListener("click", (e) => {
    const csBtn = e.target.closest(".toggle-cs-btn");
    if (!csBtn) return;
    const card = csBtn.closest(".friend-page-card");
    const id = card.dataset.friendId;
    blacklistState[id] = !blacklistState[id];
    try {
      localStorage.setItem(KEYS.BLACKLIST, JSON.stringify(blacklistState));
    } catch (err) {}
    syncBlacklistUI();
    updateChatBlockedUI();
  });

  friendTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      friendTabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFriendFilter = btn.dataset.filter;
      applyFriendsFilter();
    });
  });

  friendsFilterInput.addEventListener("input", applyFriendsFilter);
  syncBlacklistUI();

  // ==================== 8. ПОДРОБНЕЕ И ДРУЗЬЯ КНОПКА ====================
  const toggleDetailsBtn = document.getElementById("toggleDetailsBtn");
  const profileDetails = document.getElementById("profileDetails");
  toggleDetailsBtn.addEventListener("click", () => {
    const isHidden = profileDetails.classList.toggle("hidden");
    toggleDetailsBtn.textContent = isHidden ? "Подробнее ▾" : "Скрыть ▴";
  });

  const friendBtn = document.getElementById("friendBtn");
  friendBtn.addEventListener("click", () => {
    if (friendBtn.textContent.includes("В друзьях")) {
      friendBtn.textContent = "Добавить в полк";
      friendBtn.classList.replace("btn-secondary", "btn-primary");
    } else {
      friendBtn.textContent = "В друзьях ✓";
      friendBtn.classList.replace("btn-primary", "btn-secondary");
    }
  });

  // ==================== 9. СТЕНА: ПОСТЫ, ЛАЙКИ, КОММЕНТЫ (с localStorage) ====================
  const postsContainer = document.getElementById("postsContainer");

  function loadStorageObj(key, fallback) {
    try {
      const val = JSON.parse(localStorage.getItem(key));
      return val || fallback;
    } catch (e) {
      return fallback;
    }
  }

  let savedLikes = loadStorageObj(KEYS.LIKES, {});
  let savedComments = loadStorageObj(KEYS.COMMENTS, {});
  let savedCustomPosts = loadStorageObj(KEYS.POSTS, []);

  function createPostElement(postObj) {
    const article = document.createElement("article");
    article.className = "card post-card news-animate";
    article.dataset.postId = postObj.id;
    article.innerHTML = `
      <div class="post-header">
        <div class="post-avatar av-skalozub">СС</div>
        <div>
          <div class="post-author">Сергей Сергеевич Скалозуб</div>
          <div class="post-date"></div>
        </div>
      </div>
      <div class="post-text"></div>
      <div class="post-actions">
        <button class="action-btn like-btn" data-count="0">❤ <span class="count">0</span></button>
        <button class="action-btn comment-focus-btn">💬 <span>Комментировать</span></button>
      </div>
      <div class="comments-list"></div>
      <div class="add-comment-row">
        <input type="text" class="comment-input" placeholder="Написать комментарий..." />
        <button class="btn btn-secondary btn-sm send-comment-btn">Отправить</button>
      </div>
    `;
    article.querySelector(".post-date").textContent = postObj.date;
    article.querySelector(".post-text").textContent = postObj.text;

    const activeUrl = getActiveSkalozubUrl();
    if (activeUrl) {
      const av = article.querySelector(".post-avatar");
      av.style.backgroundImage = `url(${activeUrl})`;
      av.classList.add("has-photo");
    }
    return article;
  }

  function appendCommentDOM(list, text, dateStr = "только что") {
    const commentEl = document.createElement("div");
    commentEl.className = "comment";
    commentEl.innerHTML = `
      <div class="comment-avatar av-skalozub">СС</div>
      <div class="comment-body">
        <span class="comment-author">Гость страницы</span>
        <span class="comment-text"></span>
        <div class="comment-date"></div>
      </div>
    `;
    commentEl.querySelector(".comment-text").textContent = text;
    commentEl.querySelector(".comment-date").textContent = dateStr;

    const activeUrl = getActiveSkalozubUrl();
    if (activeUrl) {
      const av = commentEl.querySelector(".comment-avatar");
      av.style.backgroundImage = `url(${activeUrl})`;
      av.classList.add("has-photo");
    }
    list.appendChild(commentEl);
  }

  // Восстанавливаем пользовательские посты, лайки и комментарии
  [...savedCustomPosts].reverse().forEach((post) => {
    postsContainer.prepend(createPostElement(post));
  });

  document.querySelectorAll(".post-card").forEach((card) => {
    const id = card.dataset.postId;
    if (id && savedLikes[id]) {
      const btn = card.querySelector(".like-btn");
      btn.dataset.count = savedLikes[id].count;
      btn.querySelector(".count").textContent = savedLikes[id].count;
      btn.classList.toggle("liked", savedLikes[id].liked);
    }
    if (id && Array.isArray(savedComments[id])) {
      const list = card.querySelector(".comments-list");
      savedComments[id].forEach((c) => appendCommentDOM(list, c.text, c.date));
    }
  });

  postsContainer.addEventListener("click", (e) => {
    const likeBtn = e.target.closest(".like-btn");
    if (likeBtn) {
      const card = likeBtn.closest(".post-card");
      const id = card.dataset.postId;
      let count = parseInt(likeBtn.dataset.count, 10);
      const isLiked = likeBtn.classList.toggle("liked");
      count = isLiked ? count + 1 : count - 1;
      likeBtn.dataset.count = count;
      likeBtn.querySelector(".count").textContent = count;

      if (id) {
        savedLikes[id] = { liked: isLiked, count };
        try {
          localStorage.setItem(KEYS.LIKES, JSON.stringify(savedLikes));
        } catch (err) {}
      }
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

  function addComment(postCard, input) {
    const text = input.value.trim();
    if (!text) return;
    const id = postCard.dataset.postId;
    const list = postCard.querySelector(".comments-list");
    appendCommentDOM(list, text, "только что");
    input.value = "";

    if (id) {
      if (!savedComments[id]) savedComments[id] = [];
      savedComments[id].push({ text, date: "сохранено" });
      try {
        localStorage.setItem(KEYS.COMMENTS, JSON.stringify(savedComments));
      } catch (err) {}
    }
  }

  document.getElementById("publishPostBtn").addEventListener("click", () => {
    const input = document.getElementById("newPostInput");
    const text = input.value.trim();
    if (!text) return;

    const postObj = {
      id: `custom-${Date.now()}`,
      text,
      date: "только что"
    };
    postsContainer.prepend(createPostElement(postObj));
    savedCustomPosts.unshift(postObj);
    try {
      localStorage.setItem(KEYS.POSTS, JSON.stringify(savedCustomPosts));
    } catch (err) {}
    input.value = "";
  });

  // ==================== 10. WEB AUDIO API (ЗВУКИ МАРША И УВЕДОМЛЕНИЙ) ====================
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playNotifySound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [880, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.05, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.17);
    });
  }

  function playDrumTick(accent) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(accent ? 140 : 95, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.11);
    gain.gain.setValueAtTime(accent ? 0.16 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  function playMazurkaNote(step) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const notes = [392.0, 493.88, 587.33, 523.25, 493.88, 440.0];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(notes[step % notes.length], now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  let activeAudioInterval = null;
  let activeAudioItem = null;
  let audioStep = 0;

  document.querySelectorAll(".audio-item").forEach((item) => {
    const btn = item.querySelector(".play-btn");
    const progress = item.querySelector(".audio-progress");
    const soundType = item.dataset.sound;

    btn.addEventListener("click", () => {
      const wasPlaying = item.classList.contains("playing");
      if (activeAudioItem && activeAudioItem !== item) {
        activeAudioItem.classList.remove("playing");
        activeAudioItem.querySelector(".play-btn").textContent = "▶";
        activeAudioItem.querySelector(".audio-progress").style.width = "0%";
        clearInterval(activeAudioInterval);
      }

      if (wasPlaying) {
        item.classList.remove("playing");
        btn.textContent = "▶";
        clearInterval(activeAudioInterval);
        activeAudioItem = null;
      } else {
        item.classList.add("playing");
        btn.textContent = "⏸";
        activeAudioItem = item;
        audioStep = 0;
        let width = parseFloat(progress.style.width) || 0;
        clearInterval(activeAudioInterval);

        const tick = () => {
          width = width >= 100 ? 0 : width + 2;
          progress.style.width = `${width}%`;
          if (soundType === "mazurka") {
            playMazurkaNote(audioStep++);
          } else {
            playDrumTick(audioStep++ % 2 === 0);
          }
        };
        tick();
        activeAudioInterval = setInterval(tick, 450);
      }
    });
  });

  // ==================== 11. МЕССЕНДЖЕР + GEMINI AI ====================
  const chatModal = document.getElementById("chatModal");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const chatBlockedNotice = document.getElementById("chatBlockedNotice");
  const chatInputRow = document.getElementById("chatInputRow");
  const geminiSettingsPanel = document.getElementById("geminiSettingsPanel");
  const geminiKeyInput = document.getElementById("geminiKeyInput");
  const geminiStatusBadge = document.getElementById("geminiStatusBadge");

  const PERSONAS = {
    skalozub: {
      name: "Сергей Скалозуб",
      sub: "Полковник 45-го егерского полка",
      greeting: "Здравия желаю! Пишите коротко и по существу — как в строю: раз, два!",
      prompt: "Ты — Сергей Сергеевич Скалозуб, полковник 45-го егерского полка из комедии А. С. Грибоедова «Горе от ума». Говори отрывисто, по-военному, гордись фрунтом, чинами и орденом за 3 августа, мечтай стать генералом, презирай книги, Вольтера и учёность («учёностью меня не обморочишь»). Отвечай живо, с юмором, в 1-3 предложениях."
    },
    famusov: {
      name: "Павел Афанасьевич Фамусов",
      sub: "Управляющий в казённом месте • Москва",
      greeting: "Милости просим, голубчик! Заезжайте к нам в четверг на обед.",
      prompt: "Ты — Павел Афанасьевич Фамусов из «Горя от ума» Грибоедова. Ты важный московский барин, ценишь чины, родственные связи, старые порядки и покойного дядю Максима Петровича, боишься мнения княгини Марьи Алексевны и хочешь сжечь все книги. Отвечай по делу, образно, в 1-3 предложениях."
    },
    sofia: {
      name: "Софья Павловна Фамусова",
      sub: "Дом Фамусовых • Москва",
      greeting: "Ах, здравствуйте. Прошу вас, только не о полковых учениях...",
      prompt: "Ты — Софья Павловна Фамусова из «Горя от ума» Грибоедова. Ты романтичная, начитанная девушка, любишь французские романы, считаешь «счастливые часов не наблюдают», тайно влюблена в скромного Молчалина и вежливо, но холодно отшиваешь разговоры о военной службе. Отвечай в 1-3 предложениях."
    },
    repetilov: {
      name: "Репетилов",
      sub: "Английский клуб • Москва",
      greeting: "Шумим, братец, шумим! Поехали к князь-Григорию!",
      prompt: "Ты — Репетилов из «Горя от ума» Грибоедова. Ты суетливый, болтливый, обожаешь тайные собрания у князь-Григория по четвергам, шампанское и громкие слова, хотя сам плохо понимаешь, о чём все говорят. Отвечай эмоционально, с восклицаниями, в 1-3 предложениях."
    },
    chatsky: {
      name: "Александр Андреевич Чацкий",
      sub: "В разъездах • Москва",
      greeting: "Ну, говорите! Опять будете защищать век минувший?",
      prompt: "Ты — Александр Андреевич Чацкий из «Горя от ума» Грибоедова. Ты остроумный, язвительный, образованный свободолюбец («служить бы рад, прислуживаться тошно»), критикуешь чинопочитание, мундиры и косность московского общества. Отвечай ярко и иронично, в 1-3 предложениях."
    }
  };

  const dialogHistory = {
    skalozub: [{ role: "model", text: PERSONAS.skalozub.greeting }],
    famusov: [{ role: "model", text: PERSONAS.famusov.greeting }],
    sofia: [{ role: "model", text: PERSONAS.sofia.greeting }],
    repetilov: [{ role: "model", text: PERSONAS.repetilov.greeting }],
    chatsky: [{ role: "model", text: PERSONAS.chatsky.greeting }]
  };

  let currentPeer = "skalozub";
  let geminiApiKey = "";
  try {
    geminiApiKey = localStorage.getItem(KEYS.GEMINI_KEY) || "";
  } catch (e) {}

  function refreshGeminiBadge() {
    const active = Boolean(GEMINI_PROXY_URL || geminiApiKey);
    geminiStatusBadge.textContent = active ? "✨ Gemini AI" : "Локальный бот";
    geminiStatusBadge.classList.toggle("active", active);
    if (geminiApiKey) geminiKeyInput.value = geminiApiKey;
  }
  refreshGeminiBadge();

  document.getElementById("geminiSettingsBtn").addEventListener("click", () => {
    geminiSettingsPanel.classList.toggle("hidden");
  });

  document.getElementById("saveGeminiKeyBtn").addEventListener("click", () => {
    const val = geminiKeyInput.value.trim();
    if (!val) return;
    geminiApiKey = val;
    try {
      localStorage.setItem(KEYS.GEMINI_KEY, val);
    } catch (e) {}
    refreshGeminiBadge();
    geminiSettingsPanel.classList.add("hidden");
  });

  document.getElementById("clearGeminiKeyBtn").addEventListener("click", () => {
    geminiApiKey = "";
    geminiKeyInput.value = "";
    try {
      localStorage.removeItem(KEYS.GEMINI_KEY);
    } catch (e) {}
    refreshGeminiBadge();
  });

  function updateChatBlockedUI() {
    const isBlocked = Boolean(blacklistState[currentPeer]);
    chatBlockedNotice.classList.toggle("hidden", !isBlocked);
    chatInputRow.classList.toggle("hidden", isBlocked);
  }

  function renderDialog() {
    const persona = PERSONAS[currentPeer];
    document.getElementById("chatPeerName").textContent = persona.name;
    document.getElementById("chatPeerSub").textContent = persona.sub;
    chatMessages.innerHTML = "";

    dialogHistory[currentPeer].forEach((msg) => {
      const div = document.createElement("div");
      div.className = `chat-msg ${msg.role === "user" ? "outgoing" : "incoming"}`;
      div.textContent = msg.text;
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
    updateChatBlockedUI();
  }

  document.getElementById("dialogList").addEventListener("click", (e) => {
    const btn = e.target.closest(".dialog-item");
    if (!btn) return;
    document.querySelectorAll(".dialog-item").forEach((d) => d.classList.remove("active"));
    btn.classList.add("active");
    currentPeer = btn.dataset.peer;
    renderDialog();
  });

  function openChat(e) {
    if (e) e.preventDefault();
    chatModal.classList.remove("hidden");
    renderDialog();
    if (!blacklistState[currentPeer]) chatInput.focus();
  }

  document.getElementById("openChatBtn").addEventListener("click", openChat);
  document.getElementById("openChatSidebar").addEventListener("click", openChat);
  document.getElementById("closeChatBtn").addEventListener("click", () => chatModal.classList.add("hidden"));
  chatModal.addEventListener("click", (e) => {
    if (e.target === chatModal) chatModal.classList.add("hidden");
  });

  // Умный локальный ответчик (если ключ Gemini не указан)
  function localSmartReply(peer, text) {
    const t = text.toLowerCase();
    if (peer === "skalozub") {
      if (/книг|вольтер|уч[её]б|чита|школ|лиц/.test(t)) return "Учёностью меня не обморочишь! Книги сохранят так: для больших оказий, а я фельдфебеля в Вольтеры дам!";
      if (/генерал|чин|орден|служ|полк|арми/.test(t)) return "Я с восемьсот девятого служу, в сорок пятом егерском. Мне только бы досталось в генералы!";
      if (/жен|софь|невест|люб|свад/.test(t)) return "Жениться? Я ничуть не прочь! Павел Афанасьевич человек солидный, да и партия завидная.";
      if (/москв|пожар|город/.test(t)) return "Дистанции в Москве огромного размера, но пожар способствовал ей много к украшенью!";
      if (/чацк/.test(t)) return "Много болтает этот Чацкий. У меня он в ЧС — пусть в карете своей философии разводит!";
      return "Говорите короче, по-военному: раз, два! В полку лишних речей не любят.";
    }
    if (peer === "famusov") {
      if (/софь|доч|жен/.test(t)) return "Для Софьюшки мне нужен человек солидный, при чинах! Вот Сергей Сергеич — другое дело.";
      if (/книг|чат|уч/.test(t)) return "Уж коли зло пресечь: забрать все книги бы да сжечь! От них вся смута.";
      return "Ах, боже мой! Что станет говорить княгиня Марья Алексевна! Давайте лучше о делах в четверг за обедом.";
    }
    if (peer === "sofia") {
      if (/полк|арм|фрунт|скалозуб/.test(t)) return "Весело мне страх выслушивать о фрунте и рядах... Он совсем не моего романа.";
      if (/молчал|люб|сон/.test(t)) return "Молчалин — человек тихий, скромный, не то что крикуны. Счастливые часов не наблюдают!";
      return "Простите, я сейчас читаю французский роман и совсем не расположена к спорам.";
    }
    if (peer === "repetilov") {
      if (/клуб|княз|шампан|собра/.test(t)) return "Поехали к князь-Григорию! Там человек сорок, шампанское на убой, секретнейший союз!";
      return "Шумим, братец, шумим! Мы такие умные вещи обсуждаем — сам иной раз диву даюсь!";
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
    if (!GEMINI_PROXY_URL) {
      headers["x-goog-api-key"] = geminiApiKey;
    }

    const contents = history.slice(-10).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: PERSONAS[peer].prompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 280
        }
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const replyText = parts
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join("")
      .trim();

    if (!replyText) throw new Error("Empty Gemini response");
    return replyText;
  }

  async function sendChatMessage() {
    if (blacklistState[currentPeer]) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const peerAtSend = currentPeer;
    dialogHistory[peerAtSend].push({ role: "user", text });

    const out = document.createElement("div");
    out.className = "chat-msg outgoing";
    out.textContent = text;
    chatMessages.appendChild(out);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Индикатор «печатает...»
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
    if (currentPeer === peerAtSend) {
      typingEl.classList.remove("typing");
      typingEl.textContent = replyText;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    playNotifySound();
  }

  sendChatBtn.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
});