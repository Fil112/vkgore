document.addEventListener("DOMContentLoaded", () => {
  const KEYS = {
    AUTH_ROLE: "vk_auth_role_v1",
    GUEST_NAME: "vk_guest_name_v1",
    AVATAR: "skalozub_custom_avatar_v1",
    THEME: "vk_theme_v1",
    STATUS: "vk_status_v1",
    LIKES: "vk_likes_v1",
    COMMENTS: "vk_comments_v1",
    POSTS: "vk_custom_posts_v1",
    POLL: "vk_poll_v1",
    BLACKLIST: "vk_blacklist_v1"
  };

  const AVATAR_FILES = {
    skalozub: "avatars/skalozub.jpg",
    famusov: "avatars/famusov.jpg",
    sofia: "avatars/sofia.jpg",
    liza: "avatars/liza.jpg",
    repetilov: "avatars/repetilov.jpg",
    khlestova: "avatars/khlestova.jpg",
    chatsky: "avatars/chatsky.jpg"
  };

  // ==================== 1. РЕЖИМ ПРОФИЛЯ (СКАЛОЗУБ / ГОСТЬ) ====================
  let authRole = "guest";
  let guestName = "Гость";
  try {
    authRole = localStorage.getItem(KEYS.AUTH_ROLE) || "guest";
    guestName = localStorage.getItem(KEYS.GUEST_NAME) || "Гость";
  } catch (e) {}

  const isOwner = authRole === "skalozub";
  const headerUserName = document.getElementById("headerUserName");
  const headerMiniAvatar = document.getElementById("headerMiniAvatar");
  const guestBanner = document.getElementById("guestBanner");
  const profileActions = document.getElementById("profileActions");

  if (isOwner) {
    headerUserName.textContent = "Сергей Скалозуб";
    headerMiniAvatar.textContent = "СС";
    document.getElementById("switchAuthBtn").textContent = "Выйти";
    // Скалозуб не может писать сам себе и добавлять сам себя в друзья
    profileActions.classList.add("hidden");
  } else {
    headerUserName.textContent = guestName;
    headerMiniAvatar.textContent = guestName.slice(0, 2).toUpperCase();
    headerMiniAvatar.style.backgroundColor = "#3a86ff";
    headerMiniAvatar.style.color = "#fff";
    guestBanner.classList.remove("hidden");
    document.getElementById("guestBannerName").textContent = guestName;
    document.getElementById("switchAuthBtn").textContent = "Войти";
    document.querySelectorAll(".owner-only").forEach((el) => el.classList.add("hidden"));
  }

  // ==================== 2. ПЛАВНАЯ ТЁМНАЯ ТЕМА ====================
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  function syncThemeIcon() {
    themeToggleBtn.textContent = document.documentElement.classList.contains("dark-theme") ? "☀️" : "🌙";
  }
  syncThemeIcon();

  themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.add("theme-animating");
    const isDark = document.documentElement.classList.toggle("dark-theme");
    syncThemeIcon();
    try { localStorage.setItem(KEYS.THEME, isDark ? "dark" : "light"); } catch (e) {}
    setTimeout(() => document.documentElement.classList.remove("theme-animating"), 250);
  });

  // ==================== 3. АВАТАРКИ ====================
  const avatarUploadInput = document.getElementById("avatarUploadInput");
  const defaultAvatarSvg = document.getElementById("defaultAvatarSvg");
  const customAvatarImg = document.getElementById("customAvatarImg");
  const resetAvatarBtn = document.getElementById("resetAvatarBtn");

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
      if (isOwner) {
        resetAvatarBtn.classList.toggle("hidden", !isLocalOverride);
        headerMiniAvatar.style.backgroundImage = `url(${url})`;
        headerMiniAvatar.classList.add("has-photo");
      }
      applyAvatarToElements(".av-skalozub", url);
    } else {
      customAvatarImg.removeAttribute("src");
      customAvatarImg.classList.add("hidden");
      defaultAvatarSvg.classList.remove("hidden");
      resetAvatarBtn.classList.add("hidden");
      if (isOwner) {
        headerMiniAvatar.style.backgroundImage = "";
        headerMiniAvatar.classList.remove("has-photo");
      }
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

  if (isOwner) {
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
          ctx.drawImage(img, (img.width - minSide) / 2, (img.height - minSide) / 2, minSide, minSide, 0, 0, size, size);
          const compressedUrl = canvas.toDataURL("image/jpeg", 0.85);
          localSkalozubUrl = compressedUrl;
          renderSkalozubAvatar(compressedUrl, true);
          try { localStorage.setItem(KEYS.AVATAR, compressedUrl); } catch (err) {}
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      avatarUploadInput.value = "";
    });

    resetAvatarBtn.addEventListener("click", () => {
      localSkalozubUrl = null;
      try { localStorage.removeItem(KEYS.AVATAR); } catch (e) {}
      renderSkalozubAvatar(baseSkalozubUrl, false);
    });
  }

  // ==================== 4. СТАТУС ====================
  const profileStatus = document.getElementById("profileStatus");
  const statusEditor = document.getElementById("statusEditor");
  const statusSelect = document.getElementById("statusSelect");
  const statusCustomInput = document.getElementById("statusCustomInput");

  try {
    const savedStatus = localStorage.getItem(KEYS.STATUS);
    if (savedStatus) profileStatus.textContent = savedStatus;
  } catch (e) {}

  if (isOwner) {
    profileStatus.title = "Нажмите, чтобы изменить статус";
    profileStatus.addEventListener("click", () => {
      statusEditor.classList.toggle("hidden");
      statusCustomInput.value = "";
    });
    document.getElementById("cancelStatusBtn").addEventListener("click", () => statusEditor.classList.add("hidden"));
    document.getElementById("saveStatusBtn").addEventListener("click", () => {
      const chosen = statusCustomInput.value.trim() || statusSelect.value;
      profileStatus.textContent = chosen;
      statusEditor.classList.add("hidden");
      try { localStorage.setItem(KEYS.STATUS, chosen); } catch (e) {}
    });
  } else {
    profileStatus.style.cursor = "default";
  }

  // ==================== 5. ФОТОГРАФИИ И ЛАЙТБОКС ====================
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

  photoThumbs.forEach((btn) => btn.addEventListener("click", () => openLightbox(parseInt(btn.dataset.index, 10))));
  document.getElementById("lightboxPrev").addEventListener("click", () => openLightbox(currentPhotoIdx - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => openLightbox(currentPhotoIdx + 1));
  document.getElementById("lightboxClose").addEventListener("click", () => photoLightbox.classList.add("hidden"));
  photoLightbox.addEventListener("click", (e) => { if (e.target === photoLightbox) photoLightbox.classList.add("hidden"); });

  // ==================== 6. ОПРОС НА СТЕНЕ ====================
  const basePollCounts = [22, 16, 10];
  let userPollVote = null;
  try {
    const savedVote = localStorage.getItem(KEYS.POLL);
    if (savedVote !== null) userPollVote = parseInt(savedVote, 10);
  } catch (e) {}

  function renderPoll() {
    const counts = [...basePollCounts];
    if (userPollVote !== null && counts[userPollVote] !== undefined) counts[userPollVote] += 1;
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
    try { localStorage.setItem(KEYS.POLL, String(userPollVote)); } catch (err) {}
    renderPoll();
  });
  renderPoll();

  // ==================== 7. ВКЛАДКИ (ПРОФИЛЬ / НОВОСТИ / ДРУЗЬЯ / МУЗЫКА) ====================
  const profileView = document.getElementById("profileView");
  const friendsView = document.getElementById("friendsView");
  const musicView = document.getElementById("musicView");
  const navItems = document.querySelectorAll(".vk-nav-item");
  const navProfile = document.getElementById("navProfile");
  const navNews = document.getElementById("navNews");
  const navFriends = document.getElementById("navFriends");
  const wallSection = document.getElementById("wall");

  function setActiveNav(target) {
    navItems.forEach((item) => item.classList.remove("active"));
    if (target) target.classList.add("active");
  }

  function showView(view) {
    profileView.classList.add("hidden");
    friendsView.classList.add("hidden");
    musicView.classList.add("hidden");

    if (view === "friends") {
      friendsView.classList.remove("hidden", "view-animate");
      void friendsView.offsetWidth;
      friendsView.classList.add("view-animate");
      setActiveNav(navFriends);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (view === "music") {
      musicView.classList.remove("hidden", "view-animate");
      void musicView.offsetWidth;
      musicView.classList.add("view-animate");
      setActiveNav(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
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

  navProfile.addEventListener("click", (e) => { e.preventDefault(); showView("profile"); setActiveNav(navProfile); window.scrollTo({ top: 0, behavior: "smooth" }); });
  document.getElementById("logoHome").addEventListener("click", (e) => { e.preventDefault(); showView("profile"); setActiveNav(navProfile); window.scrollTo({ top: 0, behavior: "smooth" }); });
  navNews.addEventListener("click", (e) => {
    e.preventDefault();
    showView("profile");
    setActiveNav(navNews);
    wallSection.scrollIntoView({ behavior: "smooth", block: "start" });
    triggerNewsAnimation();
  });
  navFriends.addEventListener("click", (e) => { e.preventDefault(); showView("friends"); });
  document.getElementById("openFriendsFromSide").addEventListener("click", () => showView("friends"));
  document.getElementById("openMusicFromSide").addEventListener("click", () => showView("music"));
  document.querySelectorAll(".back-to-profile-btn").forEach((btn) => {
    btn.addEventListener("click", () => { showView("profile"); setActiveNav(navProfile); window.scrollTo({ top: 0, behavior: "smooth" }); });
  });

  if (window.location.hash === "#friends-tab") showView("friends");
  else if (window.location.hash === "#music-tab") showView("music");
  else if (window.location.hash === "#wall") { setActiveNav(navNews); triggerNewsAnimation(); }

  // ==================== 8. ДРУЗЬЯ И ЧС ====================
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
    let allCount = 0, onlineCount = 0, blCount = 0;
    friendPageCards.forEach((card) => {
      const id = card.dataset.friendId;
      const isOnline = card.dataset.online === "true";
      const isBL = Boolean(blacklistState[id]);
      card.dataset.blacklist = String(isBL);
      card.querySelector(".cs-badge").classList.toggle("hidden", !isBL);
      card.querySelector(".toggle-cs-btn").textContent = isBL ? "Убрать из ЧС" : "В ЧС";
      if (isBL) blCount++;
      else { allCount++; if (isOnline) onlineCount++; }
    });
    document.getElementById("countAll").textContent = allCount;
    document.getElementById("countOnline").textContent = onlineCount;
    document.getElementById("countBlacklist").textContent = blCount;
    document.getElementById("navFriendsBadge").textContent = allCount + blCount;
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

  if (isOwner) {
    document.getElementById("friendsPageList").addEventListener("click", (e) => {
      const csBtn = e.target.closest(".toggle-cs-btn");
      if (!csBtn) return;
      const id = csBtn.closest(".friend-page-card").dataset.friendId;
      blacklistState[id] = !blacklistState[id];
      try { localStorage.setItem(KEYS.BLACKLIST, JSON.stringify(blacklistState)); } catch (err) {}
      syncBlacklistUI();
    });
  }

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

  // Подробнее и кнопка в друзьях
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

  // ==================== 9. СТЕНА (ЛАЙКИ / КОММЕНТЫ / ПОСТЫ) ====================
  const postsContainer = document.getElementById("postsContainer");
  function loadStorageObj(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
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

  function appendCommentDOM(list, text, authorName, isSkalozubAuthor, dateStr) {
    const commentEl = document.createElement("div");
    commentEl.className = "comment";
    const initials = isSkalozubAuthor ? "СС" : authorName.slice(0, 2).toUpperCase();
    commentEl.innerHTML = `
      <div class="comment-avatar ${isSkalozubAuthor ? "av-skalozub" : "av-sofia"}"></div>
      <div class="comment-body">
        <span class="comment-author"></span>
        <span class="comment-text"></span>
        <div class="comment-date"></div>
      </div>
    `;
    const av = commentEl.querySelector(".comment-avatar");
    av.textContent = initials;
    commentEl.querySelector(".comment-author").textContent = authorName;
    commentEl.querySelector(".comment-text").textContent = text;
    commentEl.querySelector(".comment-date").textContent = dateStr;

    if (isSkalozubAuthor) {
      const activeUrl = getActiveSkalozubUrl();
      if (activeUrl) {
        av.style.backgroundImage = `url(${activeUrl})`;
        av.classList.add("has-photo");
      }
    }
    list.appendChild(commentEl);
  }

  [...savedCustomPosts].reverse().forEach((post) => postsContainer.prepend(createPostElement(post)));

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
      savedComments[id].forEach((c) => appendCommentDOM(list, c.text, c.author || "Гость", c.isSkalozub, c.date));
    }
  });

  postsContainer.addEventListener("click", (e) => {
    const likeBtn = e.target.closest(".like-btn");
    if (likeBtn) {
      const id = likeBtn.closest(".post-card").dataset.postId;
      let count = parseInt(likeBtn.dataset.count, 10);
      const isLiked = likeBtn.classList.toggle("liked");
      count = isLiked ? count + 1 : count - 1;
      likeBtn.dataset.count = count;
      likeBtn.querySelector(".count").textContent = count;
      if (id) {
        savedLikes[id] = { liked: isLiked, count };
        try { localStorage.setItem(KEYS.LIKES, JSON.stringify(savedLikes)); } catch (err) {}
      }
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

  function addComment(postCard, input) {
    const text = input.value.trim();
    if (!text) return;
    const id = postCard.dataset.postId;
    const authorName = isOwner ? "Сергей Сергеевич Скалозуб" : guestName;
    appendCommentDOM(postCard.querySelector(".comments-list"), text, authorName, isOwner, "только что");
    input.value = "";
    if (id) {
      if (!savedComments[id]) savedComments[id] = [];
      savedComments[id].push({ text, author: authorName, isSkalozub: isOwner, date: "сохранено" });
      try { localStorage.setItem(KEYS.COMMENTS, JSON.stringify(savedComments)); } catch (err) {}
    }
  }

  if (isOwner) {
    document.getElementById("publishPostBtn").addEventListener("click", () => {
      const input = document.getElementById("newPostInput");
      const text = input.value.trim();
      if (!text) return;
      const postObj = { id: `custom-${Date.now()}`, text, date: "только что" };
      postsContainer.prepend(createPostElement(postObj));
      savedCustomPosts.unshift(postObj);
      try { localStorage.setItem(KEYS.POSTS, JSON.stringify(savedCustomPosts)); } catch (err) {}
      input.value = "";
    });
  }

  // ==================== 10. МУЗЫКА (MP3 ИЗ audio/ + СИНТЕЗАТОР) ====================
  const TRACKS = [
    { id: "march", title: "Марш 45-го егерского полка", artist: "Оркестр «Раз, два!»", time: "3:05", src: "audio/march.mp3" },
    { id: "waltz", title: "Вальс ми-минор (Соч. А. Грибоедова)", artist: "А. С. Грибоедов", time: "2:45", src: "audio/waltz.mp3" },
    { id: "mazurka", title: "Мазурка на балу у Фамусовых", artist: "Московский бал", time: "2:20", src: "audio/mazurka.mp3" },
    { id: "steps", title: "Звуки шагистики на плацу", artist: "Школа Фридриха", time: "10:00", src: "audio/steps.mp3" }
  ];

  const sideAudioList = document.getElementById("sideAudioList");
  const fullMusicList = document.getElementById("fullMusicList");
  const musicVolume = document.getElementById("musicVolume");

  function renderMusicLists() {
    sideAudioList.innerHTML = "";
    fullMusicList.innerHTML = "";
    TRACKS.forEach((t) => {
      const sideEl = document.createElement("div");
      sideEl.className = "audio-item";
      sideEl.dataset.trackId = t.id;
      sideEl.innerHTML = `
        <button class="play-btn" aria-label="Воспроизвести">▶</button>
        <div class="audio-info">
          <div class="audio-title">${t.title}</div>
          <div class="audio-artist">${t.artist}</div>
          <div class="audio-bar"><div class="audio-progress"></div></div>
        </div>
        <span class="audio-time">${t.time}</span>
      `;
      sideAudioList.appendChild(sideEl);

      const fullEl = sideEl.cloneNode(true);
      fullEl.classList.add("music-track-row");
      fullMusicList.appendChild(fullEl);
    });
  }
  renderMusicLists();

  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function playSynthStep(trackId, step) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const vol = parseFloat(musicVolume.value || "0.6") * 0.15;
    const now = ctx.currentTime;

    if (trackId === "waltz") {
      const notes = [329.63, 493.88, 392.0, 369.99, 329.63, 523.25, 493.88, 440.0];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[step % notes.length], now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (trackId === "mazurka") {
      const notes = [392.0, 493.88, 587.33, 523.25, 493.88, 440.0];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(notes[step % notes.length], now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else {
      const accent = step % 2 === 0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(accent ? 140 : 95, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.11);
      gain.gain.setValueAtTime(vol * (accent ? 1.5 : 0.9), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  }

  let currentTrackId = null;
  let htmlAudio = new Audio();
  let synthInterval = null;
  let synthStep = 0;
  let synthProgress = 0;

  musicVolume.addEventListener("input", () => { htmlAudio.volume = parseFloat(musicVolume.value); });

  function syncAudioUI(trackId, pct, isPlaying) {
    document.querySelectorAll(".audio-item").forEach((el) => {
      const match = el.dataset.trackId === trackId && isPlaying;
      el.classList.toggle("playing", match);
      el.querySelector(".play-btn").textContent = match ? "⏸" : "▶";
      if (el.dataset.trackId === trackId && pct !== null) {
        el.querySelector(".audio-progress").style.width = `${pct}%`;
      } else if (!match && el.dataset.trackId !== trackId) {
        el.querySelector(".audio-progress").style.width = "0%";
      }
    });
  }

  function stopPlayback() {
    htmlAudio.pause();
    clearInterval(synthInterval);
    synthInterval = null;
    const prev = currentTrackId;
    currentTrackId = null;
    syncAudioUI(prev, 0, false);
  }

  function startTrack(trackId) {
    if (currentTrackId === trackId) { stopPlayback(); return; }
    stopPlayback();
    const track = TRACKS.find((t) => t.id === trackId);
    if (!track) return;

    currentTrackId = trackId;
    syncAudioUI(trackId, 0, true);

    htmlAudio.src = track.src;
    htmlAudio.volume = parseFloat(musicVolume.value);
    htmlAudio.play().then(() => {
      document.getElementById("musicSourceHint").textContent = `Играет файл: ${track.src}`;
    }).catch(() => {
      document.getElementById("musicSourceHint").textContent = "Играет встроенный синтезатор (можно добавить MP3 в папку audio/)";
      synthStep = 0;
      synthProgress = 0;
      const runStep = () => {
        if (currentTrackId !== trackId) return;
        synthProgress = synthProgress >= 100 ? 0 : synthProgress + 2;
        playSynthStep(trackId, synthStep++);
        syncAudioUI(trackId, synthProgress, true);
      };
      runStep();
      synthInterval = setInterval(runStep, trackId === "waltz" ? 420 : 450);
    });
  }

  htmlAudio.addEventListener("timeupdate", () => {
    if (htmlAudio.duration && currentTrackId) {
      syncAudioUI(currentTrackId, (htmlAudio.currentTime / htmlAudio.duration) * 100, true);
    }
  });

  htmlAudio.addEventListener("ended", () => {
    const idx = TRACKS.findIndex((t) => t.id === currentTrackId);
    startTrack(TRACKS[(idx + 1) % TRACKS.length].id);
  });

  [sideAudioList, fullMusicList].forEach((container) => {
    container.addEventListener("click", (e) => {
      const playBtn = e.target.closest(".play-btn");
      if (playBtn) {
        startTrack(playBtn.closest(".audio-item").dataset.trackId);
        return;
      }
      const bar = e.target.closest(".audio-bar");
      if (bar && htmlAudio.duration && bar.closest(".audio-item").dataset.trackId === currentTrackId) {
        const rect = bar.getBoundingClientRect();
        htmlAudio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * htmlAudio.duration;
      }
    });
  });
});
