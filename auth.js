// ============================================================
//  Story.fun - Privy 模拟登录/注册系统
// ============================================================

// ============================================================
//  用户数据（模拟 Privy 登录）
// ============================================================
const PRIVY_MOCK_USER = {
  id: 'user_privy_001',
  name: '加密小白',
  email: 'crypto@story.fun',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  wallet: '0x7A2b...3fD8',
  isLoggedIn: false,
  // 登录方式：'email' | 'wallet' | null
  authMethod: null,
  // 用户持有的演员 NFT 列表（持有 1 个及以上即可与任意演员进行 AI 对话）
  actorNfts: ['Luna'], // 模拟：默认持有 Luna 的 NFT
  // 模拟的币种余额
  balances: {
    story: 10123,
    usdt: 100.23
  }
};

// ============================================================
//  状态管理
// ============================================================
let currentUser = { ...PRIVY_MOCK_USER, isLoggedIn: false };

// ============================================================
//  DOM 就绪后初始化
// ============================================================
// 监听 header 加载完成事件（由 load-header.js 触发）
// 如果 header 已存在（直接内联的情况），则直接初始化
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已有 header（没有使用 load-header.js 的情况）
  const existingHeader = document.querySelector('.header');
  if (existingHeader) {
    initAuth();
  }
});

// 监听 load-header.js 发出的 header-loaded 事件
document.addEventListener('header-loaded', function() {
  initAuth();
});

function initAuth() {
  // 注入样式（只注入一次），然后查找所有 .auth-container 并渲染
  injectAuthStyles();
  const containers = document.querySelectorAll('.auth-container');
  containers.forEach(container => {
    renderAuthUI(container);
  });
}

// ============================================================
//  Inject dropdown styles
// ============================================================
function injectAuthStyles() {
  if (document.getElementById('authStyles')) return;
  const css = `
  .auth-user-menu{position:relative;display:inline-block}
  .auth-avatar{width:48px;height:48px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;border:3px solid rgba(0,0,0,0);box-sizing:border-box}
  .auth-avatar img{width:100%;height:100%;object-fit:cover;display:block}
  .auth-avatar-dot{position:absolute;right:6px;bottom:6px;width:10px;height:10px;background:#13bba3;border-radius:50%;box-shadow:0 0 0 3px rgba(19,187,163,0.12)}

  .auth-dropdown{position:absolute;right:0;top:64px;width:340px;background:#fff;border-radius:16px;padding:18px;box-shadow:0 18px 40px rgba(22,33,51,0.08);border:1px solid rgba(22,33,51,0.04);opacity:0;transform:translateY(-8px);pointer-events:none;transition:all 220ms ease;z-index:9999}
  .auth-dropdown.active,.auth-dropdown.active{opacity:1;transform:translateY(0);pointer-events:auto}

  .auth-dropdown-top{display:flex;gap:12px;align-items:center;padding-bottom:12px}
  .auth-dropdown-top-avatar{width:56px;height:56px;border-radius:12px;object-fit:cover}
  .auth-dropdown-main{font-weight:700;font-size:18px;color:#0b1720}
  .auth-dropdown-sub{color:#8b98a6;margin-top:4px}

  .auth-balance-list{margin-top:8px}
  .auth-balance-item{display:flex;align-items:center;justify-content:space-between;background:#f7f8f9;padding:12px;border-radius:12px;margin-bottom:10px}
  .auth-balance-left{display:flex;align-items:center;gap:12px}
  .auth-token-icon{width:44px;height:44px;border-radius:10px;flex:0 0 44px}
  .token-story{background:linear-gradient(135deg,#00c2a8,#00b3ff);}
  .token-usdt{background:linear-gradient(135deg,#0bb07b,#10a37a);}
  .auth-token-name{font-weight:700}
  .auth-token-sub{color:#7d8a94;font-size:13px}
  .auth-balance-amount{font-weight:700;color:#0b1720}

  .auth-balance-actions{display:flex;gap:16px;padding:12px 0}
  .btn{padding:12px 20px;border-radius:28px;font-weight:700;cursor:pointer;border:0}
  .btn-primary{background:linear-gradient(90deg,#00c2a8,#00b3ff);color:#fff}
  .btn-outline{background:transparent;border:2px solid #10b39a;color:#0b1720}

  .auth-dropdown-divider{height:1px;background:#eef2f4;margin:8px 0;border-radius:1px}
  .auth-dropdown-item{display:flex;align-items:center;gap:10px;padding:12px 6px;color:#0b1720;text-decoration:none}
  .auth-dropdown-item span{font-size:18px}
  .auth-dropdown-logout{color:#0b1720}
  `;
  const style = document.createElement('style');
  style.id = 'authStyles';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// ============================================================
//  渲染登录/用户菜单
// ============================================================
function renderAuthUI(container) {
  if (currentUser.isLoggedIn) {
    // 根据登录方式展示不同内容：邮箱登录展示充值/提现按钮，钱包登录不展示
    const isEmail = currentUser.authMethod === 'email';
    const displayName = isEmail ? currentUser.email : currentUser.name;
    const subLabel = isEmail ? '邮箱账户' : '钱包账户';
    const usdtDisplay = typeof currentUser.balances?.usdt === 'number' ? `$${currentUser.balances.usdt.toFixed(2)}` : '-';
    container.innerHTML = `
      <div class="auth-user-menu">
        <div class="auth-avatar" onclick="toggleDropdown(event)">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" />
          <span class="auth-avatar-dot"></span>
        </div>
        <div class="auth-dropdown" id="authDropdown">
          <div class="auth-dropdown-top">
            <div class="auth-dropdown-top-left">
              <img class="auth-dropdown-top-avatar" src="${currentUser.avatar}" alt="${currentUser.name}" />
            </div>
            <div class="auth-dropdown-top-right">
              <div class="auth-dropdown-main">${displayName}</div>
              <div class="auth-dropdown-sub">${subLabel}</div>
            </div>
          </div>

          <div class="auth-balance-list">
            <div class="auth-balance-item">
              <div class="auth-balance-left">
                <div class="auth-token-icon token-story"></div>
                <div>
                  <div class="auth-token-name">STORY</div>
                  <div class="auth-token-sub">Story</div>
                </div>
              </div>
              <div class="auth-balance-amount">${currentUser.balances?.story ?? '-'}
              </div>
            </div>

            <div class="auth-balance-item">
              <div class="auth-balance-left">
                <div class="auth-token-icon token-usdt"></div>
                <div>
                  <div class="auth-token-name">USDT</div>
                  <div class="auth-token-sub">Tether USD</div>
                </div>
              </div>
              <div class="auth-balance-amount">${usdtDisplay}</div>
            </div>
          </div>

          ${isEmail ? `
            <div class="auth-balance-actions">
              <button class="btn btn-primary" onclick="showToast('充值 USDT 功能开发中')">充值 USDT</button>
              <button class="btn btn-outline" onclick="showToast('提现 USDT 功能开发中')">提现 USDT</button>
            </div>
          ` : ''}

          <div class="auth-dropdown-divider"></div>
          <a class="auth-dropdown-item" href="#" onclick="showToast('🕘 交易记录开发中')">
            <span>⟳</span> 交易记录
          </a>
          <a class="auth-dropdown-item auth-dropdown-logout" href="#" onclick="handleLogout()">
            <span>🚪</span> Logout
          </a>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="auth-login-btn" onclick="openLoginModal()">
        <span class="auth-login-icon">🔑</span>
        登录 / 注册
      </button>
    `;
  }
}

// ============================================================
//  登录弹窗
// ============================================================
function openLoginModal() {
  // 移除已存在的弹窗
  const existing = document.getElementById('authLoginModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'auth-modal-overlay';
  modal.id = 'authLoginModal';
  modal.innerHTML = `
    <div class="auth-modal">
      <button class="auth-modal-close" onclick="closeLoginModal()">✕</button>
      <div class="auth-modal-header">
        <div class="auth-modal-logo">AI</div>
        <h2>欢迎来到 Story.fun</h2>
        <p>连接你的钱包，开启 AI 短剧之旅</p>
      </div>
      <div class="auth-modal-body">
        <button class="auth-social-btn auth-social-email" onclick="mockLogin('email')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          使用邮箱登录
        </button>
        <div class="auth-divider"><span>或使用钱包连接</span></div>
        <button class="auth-wallet-btn" onclick="mockLogin('wallet')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><circle cx="18" cy="12" r="2"/></svg>
          连接钱包
        </button>
        <p class="auth-modal-tos">
          继续即表示同意 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a>
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  // 触发动画
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  const modal = document.getElementById('authLoginModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================================
//  模拟登录
// ============================================================
function mockLogin(method) {
  const methodNames = {
    google: 'Google',
    twitter: 'X (Twitter)',
    email: '邮箱',
    wallet: '钱包'
  };

  // 显示加载状态
  const modal = document.getElementById('authLoginModal');
  if (modal) {
    const btns = modal.querySelectorAll('button');
    btns.forEach(b => b.disabled = true);
  }

  setTimeout(() => {
    // 登录成功
    currentUser.isLoggedIn = true;
    // 记录登录方式
    currentUser.authMethod = method;
    currentUser.name = '加密小白';
    currentUser.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    // 如果是钱包登录，显示钱包地址为主要标识（保持 name 不变）
    if (method === 'wallet') {
      currentUser.wallet = currentUser.wallet || '0x7A2b...3fD8';
    }
    // 如果是邮箱登录，把 email 占位换成示例邮箱（可按需替换）
    if (method === 'email') {
      currentUser.email = currentUser.email || 'user@example.com';
    }

    // 关闭弹窗
    closeLoginModal();

    // 重新渲染所有 auth-container
    const containers = document.querySelectorAll('.auth-container');
    containers.forEach(container => {
      renderAuthUI(container);
    });

    // 显示成功提示
    showToast(`✅ 已通过 ${methodNames[method] || 'Privy'} 登录成功`, '🎉');
  }, 800);
}

// ============================================================
//  退出登录
// ============================================================
function handleLogout() {
  if (!confirm('确定要退出登录吗？')) return;

  currentUser.isLoggedIn = false;
  currentUser.authMethod = null;

  // 关闭下拉菜单
  closeDropdown();

  // 重新渲染所有 auth-container
  const containers = document.querySelectorAll('.auth-container');
  containers.forEach(container => {
    renderAuthUI(container);
  });

  showToast('👋 已退出登录', '👋');
}

// ============================================================
//  下拉菜单
// ============================================================
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('authDropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function closeDropdown() {
  const dropdown = document.getElementById('authDropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

// 点击外部关闭下拉菜单
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('authDropdown');
  if (dropdown && dropdown.classList.contains('active')) {
    const userMenu = dropdown.closest('.auth-user-menu');
    if (userMenu && !userMenu.contains(event.target)) {
      closeDropdown();
    }
  }
});

// ============================================================
//  Toast 提示（兼容各页面已有的 toast 系统）
// ============================================================
function showToast(msg, icon) {
  // 尝试使用页面已有的 toast 系统
  const existingToast = document.getElementById('toastNotification');
  if (existingToast) {
    const msgEl = document.getElementById('toastMessage');
    const iconEl = existingToast.querySelector('.toast-icon');
    if (msgEl) msgEl.textContent = msg;
    if (iconEl && icon) iconEl.textContent = icon;
    existingToast.classList.add('show');
    clearTimeout(window._authToastTimer);
    window._authToastTimer = setTimeout(() => {
      existingToast.classList.remove('show');
    }, 3000);
    return;
  }

  // 如果没有 toast 系统，创建一个临时的
  let toast = document.getElementById('authTempToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'authTempToast';
    toast.style.cssText = `
      position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-100px);
      z-index: 99999; background: rgba(26, 35, 47, 0.95); backdrop-filter: blur(8px);
      color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 0.92rem;
      line-height: 1.6; box-shadow: 0 12px 40px rgba(27, 45, 71, 0.25);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      opacity: 0; pointer-events: none; max-width: 420px; text-align: center; font-weight: 500;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = (icon || '💡') + ' ' + msg;
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  clearTimeout(window._authToastTimer);
  window._authToastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(-100px)';
    toast.style.opacity = '0';
  }, 3000);
}
