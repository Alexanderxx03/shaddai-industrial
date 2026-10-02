// Servicio de Almacenamiento para la Lista de Cotizaciones
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem('shaddai_cart')) || [];
} catch (e) {
    console.error("Error al leer el almacenamiento local:", e);
    cart = [];
}

export const getCart = () => cart;

export const getCartCount = () => {
    return cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 1), 0);
};

export const addToCart = (product, size, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    const existing = cart.find(item => item.id === product.id && item.size === size);
    
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            mainCategory: product.mainCategory || '',
            subCategory: product.subCategory || '',
            price: product.price || 0,
            image: product.image || 'img/casaca-portada.png',
            size: size || 'M',
            quantity: qty
        });
    }
    _saveToStorage();
};

export const updateQuantity = (productId, size, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (qty <= 0) {
        removeFromCart(productId, size);
        return;
    }
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        item.quantity = qty;
        _saveToStorage();
    }
};

export const removeFromCart = (productId, size) => {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    _saveToStorage();
};

export const clearCart = () => {
    cart = [];
    _saveToStorage();
};

const _saveToStorage = () => {
    try {
        localStorage.setItem('shaddai_cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('quote:updated', { 
            detail: { 
                items: cart, 
                count: getCartCount() 
            } 
        }));
    } catch (e) {
        console.error("Error al guardar en localStorage:", e);
    }
};
