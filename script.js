:root {
  --vk-bg: #edeef0;
  --vk-card: #ffffff;
  --vk-surface: #fafbfc;
  --vk-hover: #f0f2f5;
  --vk-blue: #2688eb;
  --vk-blue-dark: #1d6fc2;
  --vk-btn-sec-bg: #e5ebf1;
  --vk-btn-sec-text: #346297;
  --vk-text: #000000;
  --vk-text-soft: #2c2d2e;
  --vk-link: #2a5885;
  --vk-muted: #818c99;
  --vk-border: #dce1e6;
  --vk-red: #e64646;
  --vk-chat-bg: #f5f7fa;
  --vk-chat-out: #cce4ff;
  --radius: 12px;
}

html.dark-theme {
  --vk-bg: #141414;
  --vk-card: #222222;
  --vk-surface: #292929;
  --vk-hover: #2f2f2f;
  --vk-blue: #71aaeb;
  --vk-blue-dark: #5c9ce6;
  --vk-btn-sec-bg: #333333;
  --vk-btn-sec-text: #e1e3e6;
  --vk-text: #e1e3e6;
  --vk-text-soft: #c4c8cc;
  --vk-link: #71aaeb;
  --vk-muted: #828282;
  --vk-border: #363738;
  --vk-chat-bg: #19191a;
  --vk-chat-out: #2b4c72;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--vk-bg);
  color: var(--vk-text);
  line-height: 1.45;
  font-size: 14px;
}

html.theme-animating body,
html.theme-animating .card,
html.theme-animating .vk-header {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Шапка */
.vk-header {
  background: var(--vk-card);
  border-bottom: 1px solid var(--vk-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.vk-header-inner {
  max-width: 1076px;
  margin: 0 auto;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vk-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--vk-text);
  font-weight: 700;
  font-size: 16px;
}

.vk-logo-badge {
  background: var(--vk-blue);
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 14px;
}

.vk-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.theme-toggle-btn {
  background: var(--vk-hover);
  border: 1px solid var(--vk-border);
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.vk-avatar-mini {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #1b4332;
  background-size: cover;
  background-position: center;
  color: #f4d35e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
  flex-shrink: 0;
}

/* Сетка */
.vk-layout {
  max-width: 1076px;
  margin: 16px auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 168px 1fr;
  gap: 16px;
}

.vk-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 64px;
}

.vk-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--vk-text);
  font-size: 13.5px;
  transition: background 0.15s, transform 0.12s;
}

.vk-nav-item:hover,
.vk-nav-item.active {
  background: var(--vk-hover);
}

.vk-nav-item:active {
  transform: scale(0.97);
}

.badge {
  background: var(--vk-btn-sec-bg);
  color: var(--vk-btn-sec-text);
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.card {
  background: var(--vk-card);
  border-radius: var(--radius);
  border: 1px solid var(--vk-border);
  overflow: hidden;
}

.guest-banner {
  background: var(--vk-card);
  border: 1px solid var(--vk-border);
  border-radius: var(--radius);
  padding: 10px 16px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13.5px;
}

/* Профиль */
.profile-cover {
  height: 160px;
  background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #7f1d1d 100%);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px 16px;
}

.profile-cover-caption {
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
}

.profile-header-body {
  padding: 0 20px 20px;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  flex-wrap: wrap;
}

.profile-avatar-wrap {
  margin-top: -54px;
  position: relative;
  flex-shrink: 0;
  width: 128px;
  height: 128px;
}

.profile-avatar-svg,
.profile-avatar-img,
.mini-avatar-circle {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 4px solid var(--vk-card);
  display: block;
  object-fit: cover;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
}

.mini-avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  overflow: hidden;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 4px;
  left: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  border: 2px solid var(--vk-card);
  transition: transform 0.15s, background 0.15s;
}

.avatar-upload-btn:hover {
  background: var(--vk-blue);
  transform: scale(1.08);
}

.avatar-reset-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--vk-card);
  background: rgba(230, 70, 70, 0.92);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-dot {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: #4bb34b;
  border: 3px solid var(--vk-card);
  border-radius: 50%;
}

.profile-info-top {
  flex: 1;
  min-width: 220px;
  padding-top: 10px;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-name-row h1 {
  font-size: 21px;
  font-weight: 700;
}

.verified-badge {
  background: var(--vk-blue);
  color: #fff;
  font-size: 11px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-status {
  margin-top: 4px;
  color: var(--vk-text-soft);
  cursor: pointer;
  display: inline-block;
  padding: 2px 6px;
  margin-left: -6px;
  border-radius: 6px;
}

.profile-status:hover {
  background: var(--vk-hover);
}

.status-editor {
  margin-top: 8px;
  padding: 10px;
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
}

.status-editor select,
.status-editor input {
  border: 1px solid var(--vk-border);
  background: var(--vk-card);
  color: var(--vk-text);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 13px;
  outline: none;
}

.status-editor-btns {
  display: flex;
  gap: 8px;
}

.profile-meta-line {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: var(--vk-muted);
  font-size: 13px;
  align-items: center;
}

.link-btn {
  background: none;
  border: none;
  color: var(--vk-blue);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.profile-actions {
  display: flex;
  gap: 8px;
  padding-top: 10px;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, opacity 0.15s;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-primary {
  background: var(--vk-blue);
  color: #fff;
}

.btn-primary:hover {
  background: var(--vk-blue-dark);
}

.btn-secondary {
  background: var(--vk-btn-sec-bg);
  color: var(--vk-btn-sec-text);
}

.btn-secondary:hover {
  opacity: 0.9;
}

.btn-danger-soft {
  background: rgba(230, 70, 70, 0.12);
  color: var(--vk-red);
}

.btn-danger-soft:hover {
  background: rgba(230, 70, 70, 0.22);
}

.profile-details {
  border-top: 1px solid var(--vk-border);
  padding: 16px 20px;
  background: var(--vk-surface);
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 10px;
  font-size: 13.5px;
}

.detail-row span {
  color: var(--vk-muted);
}

.hidden {
  display: none !important;
}

/* Двухколоночный блок */
.profile-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
}

.wall-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

#wall {
  scroll-margin-top: 64px;
}

/* Фотографии */
.photos-card {
  padding: 14px 16px;
}

.photos-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.photo-thumb {
  border: none;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  background: #1d1d1d;
  padding: 0;
  transition: transform 0.15s;
}

.photo-thumb:hover {
  transform: scale(1.03);
}

.photo-thumb svg {
  width: 100%;
  height: 100%;
  display: block;
}

.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.58);
  color: #fff;
  font-size: 11px;
  padding: 3px 4px;
  text-align: center;
}

/* Анимации */
@keyframes newsHighlight {
  0% {
    opacity: 0.25;
    transform: translateY(20px) scale(0.98);
    border-color: var(--vk-blue);
    box-shadow: 0 0 0 3px rgba(38, 136, 235, 0.28);
  }
  55% {
    opacity: 1;
    transform: translateY(-2px) scale(1.005);
    border-color: var(--vk-blue);
    box-shadow: 0 8px 22px rgba(38, 136, 235, 0.18);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    border-color: var(--vk-border);
    box-shadow: none;
  }
}

.post-card.news-animate {
  animation: newsHighlight 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes viewFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.view-animate {
  animation: viewFadeIn 0.28s ease-out both;
}

/* Новый пост */
.new-post-card {
  padding: 14px 16px;
}

.new-post-card textarea {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--vk-text);
  resize: vertical;
  outline: none;
  font-family: inherit;
  font-size: 14px;
}

.new-post-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--vk-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  color: var(--vk-muted);
  font-size: 12px;
}

/* Посты */
.post-card {
  padding: 16px;
}

#postsContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-avatar,
.comment-avatar,
.friend-av,
.friend-page-av,
.dialog-av {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.post-avatar {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.av-skalozub  { background-color: #1b4332; color: #f4d35e; }
.av-famusov   { background-color: #5a189a; }
.av-khlestova { background-color: #9b2226; }
.av-repetilov { background-color: #ca6702; }
.av-liza      { background-color: #d63384; }
.av-sofia     { background-color: #3a86ff; }
.av-chatsky   { background-color: #495057; }

.post-author {
  font-weight: 600;
  color: var(--vk-link);
}

.post-date {
  font-size: 12px;
  color: var(--vk-muted);
}

.post-text {
  margin: 12px 0;
  font-size: 14px;
}

/* Опрос */
.poll-box {
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poll-title {
  font-weight: 600;
  font-size: 13.5px;
}

.poll-option {
  position: relative;
  border: 1px solid var(--vk-border);
  background: var(--vk-card);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 9px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  text-align: left;
  font-size: 13.5px;
}

.poll-option.selected {
  border-color: var(--vk-blue);
  font-weight: 600;
}

.poll-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0%;
  background: rgba(38, 136, 235, 0.16);
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.poll-label,
.poll-percent {
  position: relative;
  z-index: 1;
}

.poll-percent {
  font-size: 12.5px;
  color: var(--vk-muted);
  font-weight: 600;
}

.poll-footer {
  font-size: 12px;
  color: var(--vk-muted);
}

.post-actions {
  display: flex;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vk-border);
}

.action-btn {
  background: var(--vk-hover);
  color: var(--vk-muted);
  border: none;
  border-radius: 16px;
  padding: 5px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.15s;
}

.action-btn:hover {
  opacity: 0.85;
}

.like-btn.liked {
  background: rgba(230, 70, 70, 0.16);
  color: var(--vk-red);
}

/* Комментарии */
.comments-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  font-size: 11px;
}

.comment-author {
  display: block;
  font-weight: 600;
  color: var(--vk-link);
}

.comment-date {
  font-size: 11.5px;
  color: var(--vk-muted);
  margin-top: 2px;
}

.add-comment-row {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.comment-input {
  flex: 1;
  border: 1px solid var(--vk-border);
  background: var(--vk-surface);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}

.comment-input:focus {
  border-color: var(--vk-blue);
}

/* Правая колонка */
.side-card {
  padding: 14px 16px;
}

.side-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.side-title-row .side-title {
  margin-bottom: 0;
}

.side-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.muted {
  color: var(--vk-muted);
  font-weight: 400;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  text-decoration: none;
  color: var(--vk-text);
  transition: opacity 0.15s;
}

.friend-item:hover {
  opacity: 0.8;
}

.friend-av {
  width: 52px;
  height: 52px;
  font-size: 15px;
}

/* Подарки */
.gifts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.gift-item {
  background: var(--vk-surface);
  border: 1px solid var(--vk-border);
  border-radius: 10px;
  padding: 8px 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: help;
}

.gift-rejected {
  opacity: 0.55;
  text-decoration: line-through;
}

.gift-emoji {
  font-size: 24px;
}

.gift-caption {
  font-size: 11px;
  color: var(--vk-muted);
}

.groups-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.groups-list li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--vk-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.group-name {
  font-weight: 500;
  font-size: 13px;
}

.group-sub {
  font-size: 12px;
  color: var(--vk-muted);
}

/* Аудиоплеер */
.audio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audio-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--vk-btn-sec-bg);
  color: var(--vk-blue);
  cursor: pointer;
  font-size: 12px;
  flex-shrink: 0;
}

.audio-item.playing .play-btn {
  background: var(--vk-blue);
  color: #fff;
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-artist {
  font-size: 11.5px;
  color: var(--vk-muted);
}

.audio-bar {
  height: 5px;
  background: var(--vk-btn-sec-bg);
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;
  cursor: pointer;
}

.audio-progress {
  height: 100%;
  width: 0%;
  background: var(--vk-blue);
  transition: width 0.3s linear;
}

.audio-time {
  font-size: 12px;
  color: var(--vk-muted);
}

.music-header-card {
  margin-bottom: 16px;
}

.music-controls-bar {
  padding: 10px 16px;
  background: var(--vk-surface);
  display: flex;
  align-items: center;
  gap: 10px;
}

.music-list-card {
  padding: 8px 16px;
}

.music-track-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--vk-border);
}

.music-track-row:last-child {
  border-bottom: none;
}

/* Вкладка Друзья */
.friends-page-header {
  margin-bottom: 16px;
}

.friends-tabs-row {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--vk-border);
  flex-wrap: wrap;
}

.friends-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.friends-tab-btn {
  background: transparent;
  border: none;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--vk-muted);
  cursor: pointer;
}

.friends-tab-btn:hover {
  background: var(--vk-hover);
  color: var(--vk-text);
}

.friends-tab-btn.active {
  background: var(--vk-btn-sec-bg);
  color: var(--vk-btn-sec-text);
}

.tab-count {
  font-size: 12px;
  opacity: 0.8;
  margin-left: 3px;
}

.friends-filter-bar {
  padding: 12px 16px;
  background: var(--vk-surface);
}

.friends-filter-bar input {
  width: 100%;
  border: 1px solid var(--vk-border);
  background: var(--vk-card);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13.5px;
  outline: none;
}

.friends-filter-bar input:focus {
  border-color: var(--vk-blue);
}

.friend-page-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid var(--vk-border);
}

.friend-page-card:last-child {
  border-bottom: none;
}

.friend-page-card:hover {
  background: var(--vk-surface);
}

.friend-page-av {
  width: 68px;
  height: 68px;
  font-size: 20px;
  text-decoration: none;
  position: relative;
}

.mini-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 13px;
  height: 13px;
  background: #4bb34b;
  border: 2px solid var(--vk-card);
  border-radius: 50%;
}

.friend-page-info {
  flex: 1;
  min-width: 0;
}

.friend-page-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vk-link);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.friend-page-name:hover {
  text-decoration: underline;
}

.cs-badge {
  background: rgba(230, 70, 70, 0.15);
  color: var(--vk-red);
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 6px;
  font-weight: 600;
}

.friend-page-meta {
  font-size: 12.5px;
  color: var(--vk-muted);
  margin-top: 2px;
}

.friend-page-status {
  font-size: 13px;
  color: var(--vk-text-soft);
  margin-top: 5px;
}

.friend-page-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

/* Отдельная страница Мессенджера */
.messenger-page-card {
  height: calc(100vh - 104px);
  min-height: 480px;
  max-height: 760px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vk-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.messenger-header-left,
.messenger-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gemini-badge {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 10px;
  background: var(--vk-hover);
  color: var(--vk-muted);
  font-weight: 600;
}

.gemini-badge.active {
  background: rgba(38, 136, 235, 0.16);
  color: var(--vk-blue);
}

.gemini-panel {
  padding: 12px 16px;
  background: var(--vk-surface);
  border-bottom: 1px solid var(--vk-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gemini-panel-title {
  font-weight: 600;
  font-size: 13px;
}

.gemini-input-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.gemini-input-row input {
  flex: 1;
  min-width: 180px;
  border: 1px solid var(--vk-border);
  background: var(--vk-card);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}

.messenger-body {
  flex: 1;
  display: grid;
  grid-template-columns: 245px 1fr;
  min-height: 0;
}

.dialog-list {
  border-right: 1px solid var(--vk-border);
  overflow-y: auto;
  background: var(--vk-surface);
}

.dialog-item {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--vk-text);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid var(--vk-border);
}

.dialog-item:hover,
.dialog-item.active {
  background: var(--vk-hover);
}

.dialog-av {
  width: 40px;
  height: 40px;
  font-size: 13px;
}

.dialog-meta {
  min-width: 0;
  flex: 1;
}

.dialog-name {
  font-weight: 600;
  font-size: 13px;
}

.dialog-preview {
  font-size: 11.5px;
  color: var(--vk-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-peer-bar {
  padding: 10px 14px;
  border-bottom: 1px solid var(--vk-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-messages {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vk-chat-bg);
}

.chat-msg {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  white-space: pre-wrap;
}

.chat-msg.incoming {
  background: var(--vk-card);
  border: 1px solid var(--vk-border);
  align-self: flex-start;
}

.chat-msg.outgoing {
  background: var(--vk-chat-out);
  align-self: flex-end;
}

.chat-msg.typing {
  color: var(--vk-muted);
  font-style: italic;
}

.chat-blocked-notice {
  padding: 12px 14px;
  background: rgba(230, 70, 70, 0.14);
  color: var(--vk-red);
  font-size: 13px;
  text-align: center;
}

.chat-input-row {
  padding: 10px 14px;
  border-top: 1px solid var(--vk-border);
  display: flex;
  gap: 8px;
}

.chat-input-row input {
  flex: 1;
  border: 1px solid var(--vk-border);
  background: var(--vk-surface);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 8px 10px;
  outline: none;
}

/* Модалка (Лайтбокс) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 200;
}

.lightbox-card {
  background: var(--vk-card);
  border-radius: 12px;
  max-width: 520px;
  width: 100%;
  padding: 16px;
  position: relative;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: var(--vk-muted);
  font-size: 20px;
  cursor: pointer;
}

.lightbox-stage {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.lightbox-img-wrap {
  flex: 1;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
}

.lightbox-img-wrap svg {
  width: 100%;
  height: 100%;
  display: block;
}

.lightbox-nav {
  border: none;
  background: var(--vk-hover);
  color: var(--vk-text);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.lightbox-caption {
  margin-top: 12px;
  font-size: 14px;
  color: var(--vk-text-soft);
}

/* Мини-профили */
.mini-back-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 10px;
  flex-wrap: wrap;
}

.blacklist-banner {
  background: rgba(230, 70, 70, 0.14);
  color: var(--vk-red);
  border: 1px solid rgba(230, 70, 70, 0.35);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 14px;
  font-weight: 500;
  font-size: 13.5px;
}

/* Страница авторизации */
.auth-wrapper {
  max-width: 820px;
  margin: 32px auto;
  padding: 0 16px;
}

.auth-intro {
  text-align: center;
  margin-bottom: 22px;
}

.auth-intro h1 {
  font-size: 24px;
  margin-bottom: 6px;
}

.auth-intro p {
  color: var(--vk-muted);
}

.auth-current-banner {
  background: var(--vk-card);
  border: 1px solid var(--vk-border);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.auth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.auth-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-av {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
}

.auth-perks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--vk-text-soft);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.auth-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.auth-label input {
  border: 1px solid var(--vk-border);
  background: var(--vk-surface);
  color: var(--vk-text);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13.5px;
  outline: none;
}

.auth-label input:focus {
  border-color: var(--vk-blue);
}

.auth-error {
  color: var(--vk-red);
  font-size: 12.5px;
  font-weight: 500;
}

/* Класс скрывающий инициалы поверх загруженного фото */
.has-photo {
  color: transparent !important;
  font-size: 0 !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  user-select: none;
}

.vk-footer {
  max-width: 1076px;
  margin: 24px auto 30px;
  padding: 0 16px;
  text-align: center;
  font-size: 12.5px;
  color: var(--vk-muted);
}

/* Адаптив */
@media (max-width: 860px) {
  .vk-layout {
    grid-template-columns: 1fr;
  }

  .vk-nav {
    flex-direction: row;
    overflow-x: auto;
    position: static;
    padding-bottom: 4px;
  }

  .vk-nav-item {
    white-space: nowrap;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .friend-page-card {
    flex-wrap: wrap;
  }

  .messenger-page-card {
    height: auto;
    min-height: 520px;
  }

  .messenger-body {
    grid-template-columns: 1fr;
  }

  .dialog-list {
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--vk-border);
  }

  .dialog-item {
    min-width: 170px;
    border-bottom: none;
    border-right: 1px solid var(--vk-border);
  }
}

@media (max-width: 720px) {
  .auth-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .vk-user-mini {
    display: none;
  }
}
