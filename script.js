/**
 * メインスクリプト — config.js の設定をDOMに反映
 */
document.addEventListener('DOMContentLoaded', () => {
  // localStorageの保存済み設定を優先し、config.jsの新フィールドはマージ
  const defaults = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : null;
  if (!defaults) return;
  const saved = localStorage.getItem('site_config');
  const C = saved ? deepMerge(JSON.parse(JSON.stringify(defaults)), JSON.parse(saved)) : defaults;
  if (!C) return;

  // ===== テーマカラー適用 =====
  applyTheme(C.theme);

  // ===== SEOメタタグ =====
  applySEO(C.seo, C.company);

  // ===== 構造化データ =====
  applyStructuredData(C);

  // ===== ヘッダー =====
  applyLogo('header-logo-img', 'header-logo-text', C.theme);
  // 電話番号をtel:リンク化
  const headerPhoneEl = document.getElementById('header-phone');
  if (headerPhoneEl && C.company.phone1.number) {
    const telNum = C.company.phone1.number.replace(/[^0-9+]/g, '');
    headerPhoneEl.innerHTML = `<a href="tel:${telNum}" style="color:inherit;text-decoration:none;">${esc(C.company.phone1.number)}</a>`;
  }
  setText('header-hours', C.company.phone1.hours);
  // ヘッダーCTAボタン
  if (C.hero.cta1) {
    const hCta1 = document.getElementById('header-cta1');
    if (hCta1) {
      setText('header-cta1-label', C.hero.cta1.label);
      if (C.hero.cta1.href) hCta1.href = C.hero.cta1.href;
      if (C.hero.cta1.external) { hCta1.setAttribute('target', '_blank'); hCta1.setAttribute('rel', 'noopener noreferrer'); }
    }
  }
  if (C.hero.cta2) {
    const hCta2 = document.getElementById('header-cta2');
    if (hCta2) {
      setText('header-cta2-label', C.hero.cta2.label);
      if (C.hero.cta2.href) hCta2.href = C.hero.cta2.href;
      if (C.hero.cta2.external) { hCta2.setAttribute('target', '_blank'); hCta2.setAttribute('rel', 'noopener noreferrer'); }
    }
  }

  // ナビゲーション
  const navEl = document.getElementById('main-nav');
  if (navEl && C.nav) {
    navEl.innerHTML = C.nav.map(n => {
      if (n.dropdown) {
        return `<div class="nav-dropdown"><a href="${esc(n.href)}" class="nav-link">${esc(n.label)} <span class="arrow">&#9662;</span></a></div>`;
      }
      return `<a href="${esc(n.href)}" class="nav-link">${esc(n.label)}</a>`;
    }).join('');
  }

  // ===== ヒーロー =====
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && C.hero.title) {
    heroTitle.innerHTML = C.hero.title.replace(/\n/g, '<br>');
  }
  const heroDesc = document.getElementById('hero-desc');
  if (heroDesc && C.hero.description) {
    heroDesc.innerHTML = C.hero.description.replace(/\n/g, '<br>');
  }
  applyCtaButton('hero-cta1', C.hero.cta1);
  applyCtaButton('hero-cta2', C.hero.cta2);

  if (C.hero.backgroundImage) {
    const placeholder = document.getElementById('hero-placeholder');
    if (placeholder) {
      placeholder.innerHTML = `<img class="hero-img-actual" src="${esc(C.hero.backgroundImage)}" alt="${esc(C.company.name)} メインビジュアル">`;
    }
  }

  // ===== コンセプト =====
  setText('concept-subtitle', C.concept.subtitle);
  setText('concept-heading', C.concept.heading);
  const descWrap = document.getElementById('concept-descriptions');
  if (descWrap && C.concept.descriptions) {
    descWrap.innerHTML = C.concept.descriptions.map(d => `<p class="concept-desc">${esc(d)}</p>`).join('');
  }
  if (C.concept.image) {
    const imgWrap = document.getElementById('concept-img-wrap');
    if (imgWrap) imgWrap.innerHTML = `<img src="${esc(C.concept.image)}" alt="コンセプトイメージ" style="width:100%;height:100%;object-fit:cover;">`;
  }

  // ===== サービス =====
  setText('service-lead', C.service.lead);
  setText('service-main-title', C.service.mainTitle);
  const serviceCards = document.getElementById('service-cards');
  if (serviceCards && C.service.items) {
    serviceCards.innerHTML = C.service.items.map((s, i) => `
      <div class="service-card fade-up${i > 0 ? ' delay-1' : ''}">
        <div class="service-card-img">
          <div class="img-placeholder">
            ${s.image ? `<img src="${esc(s.image)}" alt="${esc(s.title)}" style="width:100%;height:100%;object-fit:cover;">` : `<div class="placeholder-text">Service ${i + 1}</div>`}
          </div>
        </div>
        <div class="service-card-body">
          <h4 class="service-card-title">${esc(s.title)}</h4>
          <p class="service-card-desc">${esc(s.description)}</p>
          <a href="${esc(s.linkHref)}" class="service-card-link">${esc(s.linkText)} &rsaquo;</a>
        </div>
      </div>
    `).join('');
  }

  // ===== 選ばれる理由 =====
  const reasonCards = document.getElementById('reason-cards');
  if (reasonCards && C.reason.items) {
    reasonCards.innerHTML = C.reason.items.map((r, i) => `
      <div class="reason-card fade-up${i > 0 ? ` delay-${i}` : ''}">
        <div class="reason-icon">
          <span class="reason-icon-circle">${r.icon}</span>
        </div>
        <h4 class="reason-title">${esc(r.title)}</h4>
        <p class="reason-desc">${esc(r.description)}</p>
      </div>
    `).join('');
  }

  // ===== 事例 =====
  setText('cases-lead', C.cases.lead);
  const casesCards = document.getElementById('cases-cards');
  if (casesCards && C.cases.items) {
    casesCards.innerHTML = C.cases.items.map((c, i) => `
      <div class="case-card fade-up${i > 0 ? ` delay-${i}` : ''}">
        <div class="case-img">
          <div class="img-placeholder small">
            ${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.name)}" style="width:100%;height:100%;object-fit:cover;">` : `<div class="placeholder-text">Case ${i + 1}</div>`}
          </div>
          <span class="case-tag tag-${c.tagType === 'switch' ? 'switch' : 'new'}">${esc(c.tag)}</span>
        </div>
        <div class="case-body">
          <h4 class="case-name">${esc(c.name)}</h4>
          <p class="case-desc">${esc(c.description)}</p>
        </div>
      </div>
    `).join('');
  }

  // ===== FAQ =====
  const faqList = document.getElementById('faq-list');
  if (faqList && C.faq && C.faq.length > 0) {
    faqList.innerHTML = C.faq.map(f => `
      <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <div class="faq-question" itemprop="name" onclick="this.parentElement.classList.toggle('open')">${esc(f.question)}</div>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">${esc(f.answer)}</p>
        </div>
      </div>
    `).join('');
  } else {
    const faqSection = document.getElementById('faq');
    if (faqSection) faqSection.style.display = 'none';
  }

  // ===== お問い合わせ =====
  setText('contact-lead', C.contact.lead);
  applyCtaButton('contact-cta1', C.hero.cta1);
  applyCtaButton('contact-cta2', C.hero.cta2);
  const contactPhones = document.getElementById('contact-phones');
  if (contactPhones) {
    const phones = [C.company.phone1, C.company.phone2].filter(p => p && p.number);
    contactPhones.innerHTML = phones.map(p => {
      const telNum = p.number.replace(/[^0-9+]/g, '');
      return `
      <div class="contact-phone-card">
        <p class="phone-label">${esc(p.label)}</p>
        <p class="phone-big"><a href="tel:${telNum}" style="color:#fff;text-decoration:none;">&#128222; ${esc(p.number)}</a></p>
        <p class="phone-hours">受付時間 ${esc(p.hours)}</p>
      </div>`;
    }).join('');
  }

  // ===== 地図 =====
  setText('map-name', C.company.name);
  setText('map-address', C.company.address);
  const mapPhoneEl = document.getElementById('map-phone');
  if (mapPhoneEl && C.company.phone1) {
    const telNum = C.company.phone1.number.replace(/[^0-9+]/g, '');
    mapPhoneEl.innerHTML = `<a href="tel:${telNum}">📞 ${esc(C.company.phone1.number)}</a>`;
  }
  if (C.map) {
    setText('map-hours', C.map.hours);
    const mapEmbed = document.getElementById('map-embed');
    if (mapEmbed && C.map.embedUrl) {
      mapEmbed.innerHTML = `<iframe src="${esc(C.map.embedUrl)}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }
  }

  // ===== フッター =====
  applyLogo('footer-logo-img', 'footer-logo-text', C.theme);
  setText('footer-company', C.company.name);
  setText('footer-address', C.company.address);
  setText('footer-copyright', C.company.copyright);
  const footerNav = document.getElementById('footer-nav');
  if (footerNav && C.nav) {
    const links = C.nav.map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`);
    links.push('<a href="#">プライバシーポリシー</a>');
    footerNav.innerHTML = links.join('');
  }

  // ===== スクロールアニメーション =====
  initScrollAnimations();

  // ===== ヘッダースクロール効果 =====
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header.style.boxShadow = window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)';
  }, { passive: true });

  // ===== スムーススクロール =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
      }
    });
  });

  // ===== ハンバーガーメニュー =====
  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', () => hamburger.classList.toggle('active'));
});

// ===== ユーティリティ関数 =====

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function applyLogo(imgId, textId, theme) {
  const imgEl = document.getElementById(imgId);
  const textEl = document.getElementById(textId);
  if (theme.logoImage && imgEl) {
    imgEl.src = theme.logoImage;
    imgEl.alt = theme.logoText || '';
    imgEl.style.display = '';
    if (textEl) textEl.style.display = 'none';
  } else if (textEl) {
    textEl.textContent = theme.logoText || '';
    if (imgEl) imgEl.style.display = 'none';
  }
}

function applyCtaButton(id, cta) {
  if (!cta) return;
  const el = document.getElementById(id);
  if (!el) return;
  if (cta.href) el.href = cta.href;
  // mailto: と tel: 以外の外部リンクは新しいタブで開く
  if (cta.external && cta.href && !cta.href.startsWith('mailto:') && !cta.href.startsWith('tel:')) {
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  }
  const spans = el.querySelectorAll('span');
  if (spans[0] && cta.icon) spans[0].textContent = cta.icon;
  if (spans[1] && cta.label) spans[1].textContent = cta.label;
}

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  if (theme.primaryColor) {
    root.setProperty('--primary', theme.primaryColor);
    // auto-generate hover (slightly darker)
    root.setProperty('--primary-hover', theme.primaryHoverColor || darkenColor(theme.primaryColor, 15));
    // auto-generate light version
    root.setProperty('--primary-light', hexToRgba(theme.primaryColor, 0.15));
  }
  if (theme.darkColor) {
    root.setProperty('--dark', theme.darkColor);
    root.setProperty('--dark-hover', theme.darkHoverColor || darkenColor(theme.darkColor, 15));
  }
  if (theme.textColor) root.setProperty('--text', theme.textColor);
  if (theme.textLightColor) root.setProperty('--text-light', theme.textLightColor);
  if (theme.bgSectionColor) root.setProperty('--bg-section', theme.bgSectionColor);
  if (theme.bgFooterColor) root.setProperty('--bg-footer', theme.bgFooterColor);
  if (theme.bgContactColor) root.setProperty('--bg-contact', theme.bgContactColor);
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent / 100));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace('#', ''), 16);
  return `rgba(${num >> 16}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// ===== SEO =====
function applySEO(seo, company) {
  if (!seo) return;
  document.title = seo.title || '';
  setMeta('seo-description', 'content', seo.description);
  setMeta('seo-keywords', 'content', seo.keywords);
  if (seo.canonicalUrl) setMeta('seo-canonical', 'href', seo.canonicalUrl);
  // OGP
  setMeta('og-title', 'content', seo.title);
  setMeta('og-description', 'content', seo.description);
  setMeta('og-image', 'content', seo.ogImage);
  setMeta('og-url', 'content', seo.canonicalUrl);
  setMeta('og-sitename', 'content', company ? company.name : '');
  // Twitter
  setMeta('tw-title', 'content', seo.title);
  setMeta('tw-description', 'content', seo.description);
  setMeta('tw-image', 'content', seo.ogImage);
}

function setMeta(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

// ===== 構造化データ (JSON-LD) =====
function applyStructuredData(C) {
  // Organization
  setJsonLd('ld-organization', {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": C.company.name,
    "url": C.seo.canonicalUrl || window.location.href,
    "logo": C.theme.logoImage || '',
    "address": {
      "@type": "PostalAddress",
      "addressCountry": C.seo.region || "JP",
      "streetAddress": C.company.address
    },
    "telephone": C.company.phone1.number,
    "description": C.seo.description
  });

  // BreadcrumbList
  setJsonLd('ld-breadcrumb', {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ホーム", "item": C.seo.canonicalUrl || window.location.href }
    ]
  });

  // FAQ
  if (C.faq && C.faq.length > 0) {
    setJsonLd('ld-faq', {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": C.faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    });
  }

  // Service
  if (C.service && C.service.items) {
    setJsonLd('ld-service', {
      "@context": "https://schema.org",
      "@type": "Service",
      "provider": { "@type": "Organization", "name": C.company.name },
      "name": C.service.mainTitle,
      "description": C.service.lead,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": C.service.mainTitle,
        "itemListElement": C.service.items.map(s => ({
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": s.title, "description": s.description }
        }))
      }
    });
  }
}

function setJsonLd(id, data) {
  const el = document.getElementById(id);
  if (el) el.textContent = JSON.stringify(data);
}

// ===== スクロールアニメーション =====
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-up');
  setTimeout(() => {
    fadeEls.forEach(el => el.classList.add('animate'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
    // Fallback
    function reveal() {
      document.querySelectorAll('.fade-up.animate:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 30) el.classList.add('visible');
      });
    }
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
  }, 100);
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
