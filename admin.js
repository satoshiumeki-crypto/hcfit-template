/**
 * 管理画面ロジック
 * config.jsの設定をGUIで編集し、localStorageに保存 → config.jsとしてエクスポート
 */

let config = {};

document.addEventListener('DOMContentLoaded', () => {
  // Load config: localStorageの保存済み設定をベースに、config.jsの新しいフィールドをマージ
  // → 管理画面で編集した内容は保持しつつ、config.jsに追加された新フィールドも反映
  const defaults = JSON.parse(JSON.stringify(SITE_CONFIG));
  const saved = localStorage.getItem('site_config');
  if (saved) {
    config = deepMerge(defaults, JSON.parse(saved));
  } else {
    config = defaults;
  }

  // Tab navigation
  document.querySelectorAll('.admin-sidebar a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.admin-sidebar a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      document.getElementById(a.dataset.tab).classList.add('active');
      if (a.dataset.tab === 'tab-preview') refreshPreview();
    });
  });

  // Populate all fields from config
  populateFields();
  renderNavItems();
  renderServiceItems();
  renderReasonItems();
  renderCasesItems();
  renderFaqItems();

  // Logo upload
  setupLogoUpload();

  // OGP image upload
  setupOgpUpload();

  // Sync color pickers with hex inputs
  setupColorSync();

  // Track changes (no auto-save — user clicks save button per tab)
  // input: リアルタイム追従, change: IME確定・フォーカス離脱時, compositionend: 日本語変換確定時
  function handleFieldChange(e) {
    if (e.target.dataset && e.target.dataset.path) {
      const path = e.target.dataset.path;
      let value = e.target.value;
      setNestedValue(config, path, value);
      markUnsaved(e.target);
      // Sync color picker <-> hex
      if (e.target.type === 'color') {
        const hex = e.target.parentElement.querySelector('.color-hex');
        if (hex) hex.value = value;
      } else if (e.target.classList.contains('color-hex')) {
        const picker = e.target.parentElement.querySelector('input[type="color"]');
        if (picker && /^#[0-9a-fA-F]{6}$/.test(value)) picker.value = value;
      }
    }
  }
  document.addEventListener('input', handleFieldChange);
  document.addEventListener('change', handleFieldChange);
  document.addEventListener('compositionend', handleFieldChange);
});

// ===== Populate Fields =====
function populateFields() {
  document.querySelectorAll('[data-path]').forEach(el => {
    const val = getNestedValue(config, el.dataset.path);
    if (val !== undefined && val !== null) {
      if (el.type === 'color') el.value = val;
      else el.value = val;
    }
  });
}

// ===== Nav Items =====
function renderNavItems() {
  const container = document.getElementById('nav-items');
  if (!container) return;
  container.innerHTML = config.nav.map((n, i) => `
    <div class="item-card">
      <div class="field-row">
        <div class="field">
          <label>ラベル</label>
          <input type="text" value="${esc(n.label)}" onchange="updateNavItem(${i}, 'label', this.value)">
        </div>
        <div class="field">
          <label>リンク先</label>
          <input type="text" value="${esc(n.href)}" onchange="updateNavItem(${i}, 'href', this.value)">
        </div>
      </div>
    </div>
  `).join('');
}

function updateNavItem(i, key, value) {
  config.nav[i][key] = value;
  markUnsavedByTabId('basic');
}

// ===== Service Items =====
function renderServiceItems() {
  const container = document.getElementById('service-items');
  if (!container) return;
  container.innerHTML = config.service.items.map((s, i) => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="item-card-title">サービス ${i + 1}</span>
      </div>
      <div class="field">
        <label>タイトル</label>
        <input type="text" value="${esc(s.title)}" onchange="updateArrayItem('service.items', ${i}, 'title', this.value)">
      </div>
      <div class="field">
        <label>説明</label>
        <textarea rows="3" onchange="updateArrayItem('service.items', ${i}, 'description', this.value)">${esc(s.description)}</textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>リンクテキスト</label>
          <input type="text" value="${esc(s.linkText)}" onchange="updateArrayItem('service.items', ${i}, 'linkText', this.value)">
        </div>
        <div class="field">
          <label>リンク先</label>
          <input type="text" value="${esc(s.linkHref)}" onchange="updateArrayItem('service.items', ${i}, 'linkHref', this.value)">
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Reason Items =====
function renderReasonItems() {
  const container = document.getElementById('reason-items');
  if (!container) return;
  container.innerHTML = config.reason.items.map((r, i) => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="item-card-title">理由 ${i + 1}</span>
      </div>
      <div class="field-row">
        <div class="field" style="flex:0 0 80px;">
          <label>アイコン</label>
          <input type="text" value="${r.icon}" onchange="updateArrayItem('reason.items', ${i}, 'icon', this.value)" style="text-align:center;font-size:20px;">
        </div>
        <div class="field">
          <label>タイトル</label>
          <input type="text" value="${esc(r.title)}" onchange="updateArrayItem('reason.items', ${i}, 'title', this.value)">
        </div>
      </div>
      <div class="field">
        <label>説明</label>
        <textarea rows="3" onchange="updateArrayItem('reason.items', ${i}, 'description', this.value)">${esc(r.description)}</textarea>
      </div>
    </div>
  `).join('');
}

// ===== Cases Items =====
function renderCasesItems() {
  const container = document.getElementById('cases-items');
  if (!container) return;
  container.innerHTML = config.cases.items.map((c, i) => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="item-card-title">事例 ${i + 1}</span>
      </div>
      <div class="field-row">
        <div class="field">
          <label>タグ</label>
          <input type="text" value="${esc(c.tag)}" onchange="updateArrayItem('cases.items', ${i}, 'tag', this.value)">
        </div>
        <div class="field">
          <label>タグ種別</label>
          <select onchange="updateArrayItem('cases.items', ${i}, 'tagType', this.value)">
            <option value="new" ${c.tagType === 'new' ? 'selected' : ''}>新規開業</option>
            <option value="switch" ${c.tagType === 'switch' ? 'selected' : ''}>乗り換え</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>事例名</label>
        <input type="text" value="${esc(c.name)}" onchange="updateArrayItem('cases.items', ${i}, 'name', this.value)">
      </div>
      <div class="field">
        <label>説明</label>
        <textarea rows="2" onchange="updateArrayItem('cases.items', ${i}, 'description', this.value)">${esc(c.description)}</textarea>
      </div>
    </div>
  `).join('');
}

// ===== FAQ Items =====
function renderFaqItems() {
  const container = document.getElementById('faq-items');
  if (!container || !config.faq) return;
  container.innerHTML = config.faq.map((f, i) => `
    <div class="item-card">
      <div class="item-card-header">
        <span class="item-card-title">FAQ ${i + 1}</span>
        <button class="item-card-remove" onclick="removeFaqItem(${i})">削除</button>
      </div>
      <div class="field">
        <label>質問</label>
        <input type="text" value="${esc(f.question)}" onchange="updateFaq(${i}, 'question', this.value)">
      </div>
      <div class="field">
        <label>回答</label>
        <textarea rows="2" onchange="updateFaq(${i}, 'answer', this.value)">${esc(f.answer)}</textarea>
      </div>
    </div>
  `).join('');
}

function updateFaq(i, key, value) {
  config.faq[i][key] = value;
  markUnsavedByTabId('content');
}

function addFaqItem() {
  if (!config.faq) config.faq = [];
  config.faq.push({ question: '', answer: '' });
  markUnsavedByTabId('content');
  renderFaqItems();
}

function removeFaqItem(i) {
  config.faq.splice(i, 1);
  markUnsavedByTabId('content');
  renderFaqItems();
}

// ===== Generic Array Item Update =====
function updateArrayItem(path, index, key, value) {
  const arr = getNestedValue(config, path);
  if (arr && arr[index]) {
    arr[index][key] = value;
    // Determine which tab this belongs to
    if (path.startsWith('service') || path.startsWith('reason') || path.startsWith('cases')) {
      markUnsavedByTabId('content');
    } else if (path.startsWith('nav')) {
      markUnsavedByTabId('basic');
    }
  }
}

// ===== Logo Upload =====
function setupLogoUpload() {
  const area = document.getElementById('logo-upload');
  const input = document.getElementById('logo-file');
  const preview = document.getElementById('logo-preview');
  const text = document.getElementById('logo-upload-text');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = '#4f46e5'; });
  area.addEventListener('dragleave', () => { area.style.borderColor = '#d1d5db'; });
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.style.borderColor = '#d1d5db';
    if (e.dataTransfer.files[0]) handleLogoFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleLogoFile(input.files[0]); });

  // Show existing logo
  if (config.theme.logoImage) {
    preview.src = config.theme.logoImage;
    preview.style.display = 'block';
    text.textContent = 'クリックして変更';
  }
}

function handleLogoFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    config.theme.logoImage = dataUrl;
    markUnsavedByTabId('design');
    const preview = document.getElementById('logo-preview');
    const text = document.getElementById('logo-upload-text');
    preview.src = dataUrl;
    preview.style.display = 'block';
    text.textContent = 'クリックして変更';
    showToast('ロゴ画像を選択しました — 「デザインを保存」で反映');
  };
  reader.readAsDataURL(file);
}

// ===== OGP Image Upload =====
function setupOgpUpload() {
  const area = document.getElementById('ogp-upload');
  const input = document.getElementById('ogp-file');
  const preview = document.getElementById('ogp-preview');
  const text = document.getElementById('ogp-upload-text');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = '#4f46e5'; });
  area.addEventListener('dragleave', () => { area.style.borderColor = '#d1d5db'; });
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.style.borderColor = '#d1d5db';
    if (e.dataTransfer.files[0]) handleOgpFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleOgpFile(input.files[0]); });

  // Show existing OGP image
  if (config.seo && config.seo.ogImage) {
    preview.src = config.seo.ogImage;
    preview.style.display = 'block';
    text.textContent = 'クリックして変更';
  }
}

function handleOgpFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    config.seo.ogImage = dataUrl;
    markUnsavedByTabId('seo');
    const preview = document.getElementById('ogp-preview');
    const text = document.getElementById('ogp-upload-text');
    preview.src = dataUrl;
    preview.style.display = 'block';
    text.textContent = 'クリックして変更';
    // Also update the URL input field
    const urlInput = document.querySelector('[data-path="seo.ogImage"]');
    if (urlInput) urlInput.value = '(画像アップロード済み)';
    showToast('OGP画像を設定しました — 「SEO設定を保存」で反映');
  };
  reader.readAsDataURL(file);
}

// ===== Color Sync =====
function setupColorSync() {
  document.querySelectorAll('.color-field').forEach(field => {
    const picker = field.querySelector('input[type="color"]');
    const hex = field.querySelector('.color-hex');
    if (!picker || !hex) return;
    // Sync initial values
    const val = getNestedValue(config, picker.dataset.path);
    if (val) { picker.value = val; hex.value = val; }
  });
}

// ===== Unsaved Tracking =====
const tabMapping = {
  'company': 'basic', 'nav': 'basic',
  'theme': 'design',
  'hero': 'content', 'concept': 'content', 'service': 'content', 'reason': 'content', 'cases': 'content', 'faq': 'content', 'contact': 'content',
  'seo': 'seo'
};

function markUnsaved(inputEl) {
  // Find which tab this input belongs to
  const tabContent = inputEl.closest('.tab-content');
  if (!tabContent) return;
  const tabId = tabContent.id.replace('tab-', '');
  markUnsavedByTabId(tabId);
}

function markUnsavedByTabId(tabId) {
  const badge = document.getElementById('unsaved-' + tabId);
  if (badge) badge.classList.add('show');
}

function clearUnsaved(tabId) {
  const badge = document.getElementById('unsaved-' + tabId);
  if (badge) badge.classList.remove('show');
}

function saveCurrentTab(tabId) {
  // 保存前に全フィールドの現在値をconfigに強制反映（IME問題対策）
  syncAllFieldsToConfig();
  localStorage.setItem('site_config', JSON.stringify(config));
  clearUnsaved(tabId);
  const labels = { basic: '基本設定', design: 'デザイン', content: 'コンテンツ', seo: 'SEO設定' };
  showToast('✅ ' + (labels[tabId] || tabId) + ' を保存しました — サイトをリロードで反映');
  // プレビュータブのiframeも自動更新
  const frame = document.getElementById('preview-frame');
  if (frame) frame.src = 'index.html?' + Date.now();
}

// 全data-pathフィールドの現在の値をconfigオブジェクトに強制同期
function syncAllFieldsToConfig() {
  document.querySelectorAll('[data-path]').forEach(el => {
    const path = el.dataset.path;
    const value = el.value;
    if (path && value !== undefined) {
      setNestedValue(config, path, value);
    }
  });
}

// ===== Save / Load / Export =====
function saveConfig() {
  localStorage.setItem('site_config', JSON.stringify(config));
  showToast('保存しました');
}

function resetConfig() {
  if (!confirm('すべての設定をデフォルトに戻しますか？')) return;
  localStorage.removeItem('site_config');
  config = JSON.parse(JSON.stringify(SITE_CONFIG));
  populateFields();
  renderNavItems();
  renderServiceItems();
  renderReasonItems();
  renderCasesItems();
  renderFaqItems();
  setupColorSync();
  showToast('デフォルト設定に戻しました');
}

function downloadConfig() {
  const content = `/**\n * サイト設定ファイル\n * admin.html の管理画面から生成されました\n * 生成日時: ${new Date().toLocaleString('ja-JP')}\n */\nconst SITE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
  const blob = new Blob([content], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.js';
  a.click();
  URL.revokeObjectURL(url);
  showToast('config.js をダウンロードしました');
}

function openPreview() {
  window.open('index.html', '_blank');
}

function refreshPreview() {
  const frame = document.getElementById('preview-frame');
  if (frame) frame.src = 'index.html?' + Date.now();
}

// ===== Utilities =====
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => {
    if (o[k] === undefined) o[k] = {};
    return o[k];
  }, obj);
  target[last] = value;
}

function esc(str) {
  if (str === undefined || str === null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Deep Merge =====
// defaultsをベースに、savedの値で上書き（savedにあるキーだけ上書き、defaultsの新キーは保持）
function deepMerge(defaults, saved) {
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
    if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key])
        && defaults[key] && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
      result[key] = deepMerge(defaults[key], saved[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

// ===== GitHub連携 =====

function saveGitHubSettings() {
  const token = document.getElementById('github-token').value.trim();
  const owner = document.getElementById('github-owner').value.trim();
  const repo = document.getElementById('github-repo').value.trim();
  if (!token || !owner || !repo) {
    showToast('すべての項目を入力してください');
    return;
  }
  localStorage.setItem('github_settings', JSON.stringify({ token, owner, repo }));
  showToast('✅ GitHub設定を保存しました');
}

function loadGitHubSettings() {
  const saved = localStorage.getItem('github_settings');
  if (!saved) return null;
  const s = JSON.parse(saved);
  // フォームにも反映
  const tokenEl = document.getElementById('github-token');
  const ownerEl = document.getElementById('github-owner');
  const repoEl = document.getElementById('github-repo');
  if (tokenEl && s.token) tokenEl.value = s.token;
  if (ownerEl && s.owner) ownerEl.value = s.owner;
  if (repoEl && s.repo) repoEl.value = s.repo;
  return s;
}

async function testGitHubConnection() {
  const s = loadGitHubSettings();
  if (!s) { showStatus('❌ GitHub設定を先に保存してください', 'red'); return; }
  showStatus('接続テスト中...', '#666');
  try {
    const res = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}`, {
      headers: { 'Authorization': `token ${s.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      showStatus(`✅ 接続成功！リポジトリ: ${data.full_name}`, 'green');
    } else {
      showStatus(`❌ 接続失敗（${res.status}）。トークンとリポジトリ名を確認してください`, 'red');
    }
  } catch (e) {
    showStatus('❌ 接続エラー: ' + e.message, 'red');
  }
}

async function publishToGitHub() {
  const s = loadGitHubSettings();
  if (!s) {
    showToast('GitHub連携タブで設定を先に行ってください');
    return;
  }

  const btn = document.getElementById('publish-btn');
  btn.textContent = '⏳ 公開中...';
  btn.disabled = true;

  try {
    // 保存前に全フィールドの値をconfigに反映
    syncAllFieldsToConfig();
    localStorage.setItem('site_config', JSON.stringify(config));

    // config.jsの内容を生成
    const content = `/**\n * サイト設定ファイル\n * 管理画面から自動生成\n * 更新日時: ${new Date().toLocaleString('ja-JP')}\n */\nconst SITE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
    const encoded = btoa(unescape(encodeURIComponent(content)));

    // 既存ファイルのSHAを取得（更新にはSHAが必要）
    const getRes = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}/contents/config.js`, {
      headers: { 'Authorization': `token ${s.token}` }
    });
    let sha = '';
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    // config.jsをGitHubにプッシュ
    const body = {
      message: `config.js を更新 (${new Date().toLocaleString('ja-JP')})`,
      content: encoded,
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}/contents/config.js`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${s.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (putRes.ok) {
      showToast('✅ サイトに公開しました！1〜2分でNetlifyに反映されます');
      // 全タブのunsavedバッジをクリア
      ['basic', 'design', 'content', 'seo'].forEach(t => clearUnsaved(t));
    } else {
      const err = await putRes.json();
      showToast('❌ 公開失敗: ' + (err.message || putRes.status));
    }
  } catch (e) {
    showToast('❌ エラー: ' + e.message);
  } finally {
    btn.textContent = '🚀 サイトに公開';
    btn.disabled = false;
  }
}

function showStatus(msg, color) {
  const el = document.getElementById('github-status');
  if (el) { el.textContent = msg; el.style.color = color; }
}

// ページ読み込み時にGitHub設定を復元
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => loadGitHubSettings(), 100);
});
