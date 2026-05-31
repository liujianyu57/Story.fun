// ============================================================
//  Story.fun - 统一 Header 加载脚本
//  自包含 Header 样式（自动注入），各页面无需重复编写
// ============================================================

(function() {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '' || currentPage.endsWith('/')) {
    currentPage = 'index.html';
  }
  const headerPath = 'header.html';

  // ============================================================
  //  注入 Header 样式（仅一次）
  // ============================================================
  function injectHeaderStyles() {
    if (document.getElementById('story-header-styles')) return;

    const css = `
/* ── Story.fun Header Styles ── */
.story-header-wrapper .header {
  width: 100%;
  background: #ffffff;
  border-bottom: 0.5px solid #D9D9E0;
}
.story-header-wrapper .header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 88px;
}
.story-header-wrapper .brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.story-header-wrapper .header-logo-svg {
  width: 29px;
  height: 29px;
  display: block;
}
.story-header-wrapper .brand-text {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 590;
  font-size: 19.64px;
  background: linear-gradient(45deg, #05DF72 0%, #00BBA7 50%, #00B8DB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}
.story-header-wrapper .nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.story-header-wrapper .nav-link {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #60646C;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .nav-link:hover {
  color: #1C2024;
  background: rgba(0,0,0,0.03);
}
.story-header-wrapper .nav-link.active {
  color: #1C2024;
  border-radius: 999px;
}
.story-header-wrapper .header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.story-header-wrapper .lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 6px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 32px;
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #60646C;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .lang-btn:hover {
  background: rgba(0,0,0,0.04);
}
.story-header-wrapper .lang-btn svg {
  flex-shrink: 0;
}
.story-header-wrapper .auth-container {
  display: flex;
  align-items: center;
}

/* ── Auth Button ── */
.story-header-wrapper .auth-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 0;
  font-family: "Rubik", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  background: linear-gradient(45deg, #05DF72 0%, #00BBA7 50%, #00B8DB 100%);
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .auth-login-btn:hover {
  opacity: 0.9;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .story-header-wrapper .header-inner {
    padding: 16px 40px;
  }
}
@media (max-width: 768px) {
  .story-header-wrapper .header-inner {
    padding: 12px 20px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .story-header-wrapper .nav-links {
    order: 3;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .story-header-wrapper .nav-links::-webkit-scrollbar {
    display: none;
  }
  .story-header-wrapper .lang-btn span {
    display: none;
  }
}
@media (max-width: 480px) {
  .story-header-wrapper .header-inner {
    padding: 10px 16px;
  }
  .story-header-wrapper .brand-text {
    font-size: 16px;
  }
  .story-header-wrapper .nav-link {
    font-size: 13px;
    padding: 8px 10px;
  }
}
`;

    const style = document.createElement('style');
    style.id = 'story-header-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // ============================================================
  //  插入 Header HTML
  // ============================================================
  function insertHeaderHtml(html) {
    injectHeaderStyles();

    // 用 wrapper 包裹以应用命名空间样式
    const wrappedHtml = '<div class="story-header-wrapper">' + html + '</div>';

    const placeholders = document.querySelectorAll('#header-placeholder');
    if (placeholders.length > 0) {
      placeholders.forEach(placeholder => {
        placeholder.outerHTML = wrappedHtml;
      });
    }

    // 标记当前页面导航为 active
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });

    document.dispatchEvent(new CustomEvent('header-loaded'));
  }

  // ============================================================
  //  Fallback HTML（当 header.html 加载失败时使用）
  // ============================================================
  function insertHeaderFallback() {
    const html = `
<div class="header">
  <div class="header-inner">
    <div class="brand">
      <svg class="header-logo-svg" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fbLogoGrad" x1="0" y1="28.57" x2="28.57" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#05DF72"/>
            <stop offset="0.5" stop-color="#00BBA7"/>
            <stop offset="1" stop-color="#00B8DB"/>
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="28" height="28" rx="8" fill="url(#fbLogoGrad)" fill-opacity="0.12" stroke="url(#fbLogoGrad)" stroke-width="1"/>
        <path d="M14.5 6.5L9 15.5H20L14.5 6.5Z" fill="url(#fbLogoGrad)"/>
        <path d="M14.5 22.5L9 13.5H20L14.5 22.5Z" fill="url(#fbLogoGrad)" fill-opacity="0.5"/>
      </svg>
      <span class="brand-text">Story.fun</span>
    </div>
    <nav class="nav-links">
      <a class="nav-link" href="index.html">首页</a>
      <a class="nav-link" href="theater.html">剧场</a>
      <a class="nav-link" href="actors.html">演员</a>
      <a class="nav-link" href="narrator.html">叙事者中心</a>
      <a class="nav-link" href="rewards.html">收益</a>
      <a class="nav-link" href="mining.html">挖矿</a>
      <a class="nav-link" href="whitepaper.html">白皮书</a>
    </nav>
    <div class="header-actions">
      <button class="lang-btn" aria-label="Language">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60646C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>Language</span>
      </button>
      <div class="auth-container" id="authContainer"></div>
    </div>
  </div>
</div>
`;
    insertHeaderHtml(html);
  }

  // ============================================================
  //  XHR 回退加载
  // ============================================================
  function tryLoadHeaderByXHR() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', headerPath);
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 0) {
          insertHeaderHtml(xhr.responseText);
        } else {
          console.warn('Header XHR 状态异常:', xhr.status);
          insertHeaderFallback();
        }
      };
      xhr.onerror = function() {
        console.warn('Header XHR 失败');
        insertHeaderFallback();
      };
      xhr.send();
    } catch (error) {
      console.warn('Header XHR 异常:', error);
      insertHeaderFallback();
    }
  }

  // ============================================================
  //  主加载流程
  // ============================================================
  fetch(headerPath)
    .then(response => {
      if (!response.ok) throw new Error('Header 加载失败');
      return response.text();
    })
    .then(insertHeaderHtml)
    .catch(err => {
      console.warn('Header fetch 失败，尝试 XHR 或直接回退:', err);
      tryLoadHeaderByXHR();
    });
})();
