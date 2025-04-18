let cartItems = [
    {
        id: 1,
        name: "Серьги из белого золота с бриллиантами",
        size: "One Size",
        price: 47940,
        oldPrice: 52940,
        quantity: 1,
        image: "assets/media/product/product1.png"
    },
    {
        id: 2,
        name: "Кольцо из белого золота с бриллиантами",
        size: "Размер 17.0",
        price: 35310,
        oldPrice: null,
        quantity: 1,
        image: "assets/media/product/product2.png"
    }
];

// Элементы DOM
const myCartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Функция рендеринга корзины
function renderCart() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = `
        <button class="close-cart" id="closeCart">×</button>
        <h2>В КОРЗИНЕ <span id="cartCount">${cartItems.length}</span> ТОВАРА</h2>
    `;

    cartItems.forEach(item => {
        const itemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <p>${item.name}</p>
                    <span class="size">${item.size}</span>
                    <div class="quantity-price">
                        <div class="quantity-controls">
                            <button class="decrease">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button class="increase">+</button>
                        </div>
                        <div>
                            <strong class="current-price">${(item.price * item.quantity).toLocaleString()} руб.</strong>
                            ${item.oldPrice ? `<div class="old-price">${(item.oldPrice * item.quantity).toLocaleString()} руб.</div>` : ''}
                        </div>
                    </div>
                </div>
                <button class="remove-item">×</button>
            </div>
        `;
        cartContent.innerHTML += itemHTML;
    });

    cartContent.innerHTML += `
        <div class="cart-summary">
            <p>ТОВАРЫ НА СУММУ: <strong id="cartTotal">${calculateTotal().toLocaleString()} руб.</strong></p>
            <p>ДОСТАВКА: <strong>БЕСПЛАТНО</strong></p>
        </div>
        <a href="placinganorder.html" class="checkout-btn" id="checkoutBtn">Перейти к оформлению заказа</a>
    `;

    updateCheckoutButton();
    addEventListeners();
}

// Расчет итоговой суммы
function calculateTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Обновление состояния кнопки оформления
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = cartItems.length === 0;
}

// Добавление обработчиков событий
function addEventListeners() {
    // Закрытие корзины
    document.getElementById('closeCart').addEventListener('click', hideCart);

    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.parentElement.getAttribute('data-id'));
            cartItems = cartItems.filter(item => item.id !== itemId);
            renderCart();
            saveCart();
        });
    });

    // Увеличение количества
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.closest('.cart-item').getAttribute('data-id'));
            const item = cartItems.find(item => item.id === itemId);
            if (item.quantity < 10) {
                item.quantity++;
                renderCart();
                saveCart();
            }
        });
    });

    // Уменьшение количества
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.closest('.cart-item').getAttribute('data-id'));
            const item = cartItems.find(item => item.id === itemId);
            if (item.quantity > 1) {
                item.quantity--;
                renderCart();
                saveCart();
            }
        });
    });

    // Закрытие при клике вне окна
    myCartModal.addEventListener('click', (e) => {
        if (e.target === myCartModal) {
            hideCart();
        }
    });
}

// Показать корзину
function showCart() {
    myCartModal.style.display = 'flex';
    setTimeout(() => myCartModal.classList.add('show'), 10);
}

// Скрыть корзину
function hideCart() {
    myCartModal.classList.remove('show');
    setTimeout(() => myCartModal.style.display = 'none', 300);
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Загрузка корзины из localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    renderCart();
}

// Инициализация
window.addEventListener('load', () => {
    loadCart(); // Загружаем корзину
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    } else {
        console.error('Кнопка корзины не найдена');
    }
});
