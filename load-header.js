// ============================================================
//  Story.fun - 统一 Header 加载脚本
//  自动加载 header.html 并标记当前页面导航为 active
// ============================================================

(function() {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  // 处理根路径或空路径的情况（如直接访问 / 或 /Story.fun/）
  if (!currentPage || currentPage === '' || currentPage.endsWith('/')) {
    currentPage = 'index.html';
  }
  const headerPath = 'header.html';

  function insertHeaderHtml(html) {
    const placeholders = document.querySelectorAll('#header-placeholder');
    if (placeholders.length > 0) {
      placeholders.forEach(placeholder => {
        placeholder.outerHTML = html;
      });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });

    document.dispatchEvent(new CustomEvent('header-loaded'));
  }

  function insertHeaderFallback() {
    const html = `
<div class="header">
  <div class="brand">
    <div class="icon">AI</div>
    <div>
      <h1>Story.fun</h1>
      <span class="small">创造属于自己的故事</span>
    </div>
  </div>
  <nav class="nav-links" aria-label="页面导航">
    <a class="nav-link" href="index.html">首页</a>
    <a class="nav-link" href="theater.html">剧场</a>
    <a class="nav-link" href="actors.html">演员</a>
    <a class="nav-link" href="narrator.html">叙事者中心</a>
    <a class="nav-link" href="rewards.html">收益</a>
    <a class="nav-link" href="mining.html">挖矿</a>
  </nav>
  <div class="auth-container" id="authContainer"></div>
</div>
`;
    insertHeaderHtml(html);
  }

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
