// Control de widgets flotantes (sincronización reactiva de cotización)
export function updateFloatingCart(detailCount = null) {
    try {
        let count = detailCount;
        if (count === null) {
            const cartData = JSON.parse(localStorage.getItem('shaddai_cart')) || [];
            count = cartData.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 1), 0);
        }
        
        const floatingBadge = document.getElementById('floating-cart-count');
        if (floatingBadge) {
            floatingBadge.textContent = count;
            if (count > 0) {
                floatingBadge.classList.remove('hidden');
            }
        }

        // Sincronizar con el contador de la cabecera si existe en la página
        const headerBadge = document.getElementById('cart-count');
        if (headerBadge) {
            headerBadge.textContent = count;
            if (count > 0) {
                headerBadge.classList.remove('hidden');
            }
        }
    } catch (e) {
        console.error("Error al actualizar el contador de cotización:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar al cargar la página
    updateFloatingCart();

    // Escuchar eventos reactivos de cotización (dentro de la misma pestaña)
    window.addEventListener('quote:updated', (e) => {
        const count = e.detail && typeof e.detail.count === 'number' ? e.detail.count : null;
        updateFloatingCart(count);
    });

    // Sincronizar cuando hay cambios en el almacenamiento (entre diferentes pestañas)
    window.addEventListener('storage', (e) => {
        if (e.key === 'shaddai_cart') {
            updateFloatingCart();
        }
    });
});

