// 顯示價格提示框
function showPrice(item, price) {
    alert(`${item} 的價格是 $${price}`);
}

// 表單提交後顯示確認訊息
function submitForm(event) {
    event.preventDefault(); // 阻止表單的預設行為
    alert('表單已提交，感謝您的聯絡！');
    document.getElementById('contactForm').reset(); // 清空表單
}

// 回到頂端按鈕顯示與隱藏
window.onscroll = function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
};

// 平滑滾動回到頂端
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DOM 元素載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollEffects();
    initMenuFilter();
    initFormValidation();
    initAnimations();
});

// 手機版選單
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    menuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.setAttribute('aria-expanded', 
            this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });

    // 點擊選單項目後關閉選單
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// 滾動效果
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        // 回到頂端按鈕顯示/隱藏
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 200) {
                    scrollTopBtn.style.display = 'none';
                }
            }, 300);
        }

        // 導航欄滾動效果
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
}

// 菜單分類過濾
function initMenuFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按鈕狀態
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 過濾菜單項目
            const category = btn.dataset.category;
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 表單驗證
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // 即時驗證
        input.addEventListener('input', () => {
            validateInput(input);
        });

        // 失去焦點時驗證
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 驗證所有輸入
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // 顯示提交動畫
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送出中...';
            submitBtn.disabled = true;

            // 模擬表單提交
            setTimeout(() => {
                showNotification('感謝您的訊息！我們會盡快回覆。', 'success');
                form.reset();
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 送出訊息';
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

// 驗證單個輸入
function validateInput(input) {
    const value = input.value.trim();
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        createErrorElement(input);

    // 移除之前的錯誤狀態
    input.classList.remove('invalid');
    errorElement.style.display = 'none';

    // 必填欄位驗證
    if (input.required && !value) {
        showError(input, errorElement, '此欄位為必填');
        return false;
    }

    // Email格式驗證
    if (input.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(input, errorElement, '請輸入有效的電子郵件地址');
            return false;
        }
    }

    // 電話格式驗證
    if (input.type === 'tel' && value) {
        const phonePattern = /^[0-9]{4}-?[0-9]{6}$/;
        if (!phonePattern.test(value.replace(/-/g, ''))) {
            showError(input, errorElement, '請輸入有效的電話號碼');
            return false;
        }
    }

    return true;
}

// 顯示錯誤訊息
function showError(input, errorElement, message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 創建錯誤訊息元素
function createErrorElement(input) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    input.parentElement.appendChild(errorElement);
    return errorElement;
}

// 顯示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // 動畫效果
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 自動關閉
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 訂購功能
function orderItem(itemName, price) {
    const orderInfo = `
        <div class="order-info">
            <h3>訂購 ${itemName}</h3>
            <p class="price">NT$ ${price}</p>
            <div class="quantity">
                <button onclick="updateQuantity(this, -1)">-</button>
                <input type="number" value="1" min="1" max="10" onchange="validateQuantity(this)">
                <button onclick="updateQuantity(this, 1)">+</button>
            </div>
            <button class="btn btn-primary" onclick="confirmOrder('${itemName}', ${price}, this)">
                <i class="fas fa-shopping-cart"></i> 確認訂購
            </button>
        </div>
    `;

    showModal('訂購資訊', orderInfo);
}

// 更新數量
function updateQuantity(btn, change) {
    const input = btn.parentElement.querySelector('input');
    let value = parseInt(input.value) + change;
    value = Math.max(1, Math.min(10, value));
    input.value = value;
}

// 驗證數量
function validateQuantity(input) {
    let value = parseInt(input.value);
    value = Math.max(1, Math.min(10, value));
    input.value = value;
}

// 確認訂購
function confirmOrder(itemName, price, btn) {
    const quantity = btn.parentElement.querySelector('input').value;
    const total = price * quantity;
    
    const confirmInfo = `
        <div class="confirm-order">
            <h3>訂單確認</h3>
            <p>品項：${itemName}</p>
            <p>數量：${quantity}</p>
            <p>總價：NT$ ${total}</p>
            <p class="note">請撥打電話 0123-456789 完成訂購</p>
            <button class="btn btn-primary" onclick="closeModal()">
                <i class="fas fa-check"></i> 確定
            </button>
        </div>
    `;

    showModal('訂單確認', confirmInfo);
}

// 顯示模態框
function showModal(title, content) {
    let modal = document.querySelector('.modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 點擊外部關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // 顯示動畫
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 關閉模態框
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 平滑滾動
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 動畫效果
function initAnimations() {
    // 觀察元素進入視窗
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // 添加觀察的元素
    document.querySelectorAll('.feature-item, .menu-item, .info-card').forEach(el => {
        observer.observe(el);
    });
}
