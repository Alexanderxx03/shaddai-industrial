import { getCart, updateQuantity, removeFromCart, clearCart } from './cart.service.js';

export const renderCheckout = () => {
    const list = document.getElementById('checkout-items');
    const totalQtyEl = document.getElementById('total-items-count');
    const totalRefEl = document.getElementById('total-ref-amount');
    const submitBtn = document.getElementById('btn-send-whatsapp');
    
    if (!list) return;

    const cart = getCart();

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="py-12 text-center text-gray-500">
                <span class="material-symbols-outlined text-4xl text-gray-300 mb-2 block">assignment_late</span>
                <p class="font-bold text-gray-700 mb-1">Su lista de cotización está vacía</p>
                <p class="text-xs text-gray-400 mb-4">Agregue las prendas industriales que su empresa necesita para armar la proforma.</p>
                <a href="products.html" class="inline-flex items-center gap-2 bg-ind-blue text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ind-blue-dark transition-all">
                    <span class="material-symbols-outlined text-[16px]">visibility</span> Ver Catálogo
                </a>
            </div>
        `;
        if (totalQtyEl) totalQtyEl.textContent = "0";
        if (totalRefEl) totalRefEl.textContent = "S/ 0.00";
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    if (submitBtn) submitBtn.disabled = false;
    list.innerHTML = '';
    let totalItems = 0;
    let totalRef = 0;

    cart.forEach(item => {
        const qty = parseInt(item.quantity) || 1;
        const subtotal = (item.price || 0) * qty;
        totalItems += qty;
        totalRef += subtotal;

        const row = document.createElement('div');
        row.className = "flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:border-ind-blue/30";
        row.innerHTML = `
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <img src="${item.image || 'img/casaca-portada.png'}" alt="${item.name}" 
                     class="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200 shrink-0" 
                     onerror="this.onerror=null; this.src='img/casaca-portada.png';" />
                <div class="min-w-0">
                    <h4 class="font-bold text-xs text-gray-800 truncate">${item.name}</h4>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[11px] font-bold text-ind-blue bg-blue-50 px-2 py-0.5 rounded">Talla: ${item.size}</span>
                        <span class="text-[10px] text-gray-400">Ref: S/ ${(item.price || 0).toFixed(2)} c/u</span>
                    </div>
                </div>
            </div>

            <!-- Controles de Cantidad -->
            <div class="flex items-center gap-2 shrink-0">
                <button type="button" onclick="window.changeItemQty('${item.id}', '${item.size}', ${qty - 1})" 
                        class="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 font-bold transition-all text-xs">
                    -
                </button>
                <input type="number" min="1" value="${qty}" 
                       onchange="window.changeItemQty('${item.id}', '${item.size}', this.value)"
                       class="w-12 text-center text-xs font-bold bg-white border border-gray-200 rounded-lg py-1 text-gray-800 outline-none focus:border-ind-blue" />
                <button type="button" onclick="window.changeItemQty('${item.id}', '${item.size}', ${qty + 1})" 
                        class="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 font-bold transition-all text-xs">
                    +
                </button>
                <button type="button" onclick="window.removeItemFromQuote('${item.id}', '${item.size}')" 
                        class="w-7 h-7 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all ml-1" title="Eliminar de la lista">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
        `;
        list.appendChild(row);
    });

    if (totalQtyEl) totalQtyEl.textContent = `${totalItems} prendas`;
    if (totalRefEl) totalRefEl.textContent = `S/ ${totalRef.toFixed(2)}`;
};

window.changeItemQty = (productId, size, newQty) => {
    updateQuantity(productId, size, parseInt(newQty) || 1);
    renderCheckout();
};

window.removeItemFromQuote = (productId, size) => {
    removeFromCart(productId, size);
    renderCheckout();
};

window.clearEntireQuote = () => {
    if (confirm("¿Desea vaciar toda la lista de cotización?")) {
        clearCart();
        renderCheckout();
    }
};

window.handleSendWhatsAppQuote = (e) => {
    if (e) e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert("Agregue al menos un producto para solicitar la cotización.");
        return;
    }

    const company = (document.getElementById('quote-company')?.value || '').trim();
    const name = (document.getElementById('quote-name')?.value || '').trim();
    const doc = (document.getElementById('quote-doc')?.value || '').trim();
    const phone = (document.getElementById('quote-phone')?.value || '').trim();
    const city = (document.getElementById('quote-city')?.value || '').trim();
    const email = (document.getElementById('quote-email')?.value || '').trim();
    const embroidery = document.getElementById('quote-embroidery')?.checked ? 'SÍ (Bordado computarizado requerido)' : 'NO (Prenda lisa)';
    const notes = (document.getElementById('quote-notes')?.value || '').trim();

    if (!name && !company) {
        alert("Por favor ingrese el Nombre de Contacto o Razón Social de su empresa.");
        document.getElementById('quote-company')?.focus();
        return;
    }

    let itemsListText = '';
    let totalPrendas = 0;

    cart.forEach((item, idx) => {
        const qty = parseInt(item.quantity) || 1;
        totalPrendas += qty;
        itemsListText += `${idx + 1}. *${item.name}*\n   • Talla: ${item.size}\n   • Cantidad: ${qty} unidades\n   • Categoría: ${item.mainCategory || 'Ropa Industrial'}\n`;
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let message = `*SOLICITUD DE COTIZACIÓN FORMAL*\n` +
        `*INVERSIONES SHADDAI - HUANCAYO*\n` +
        `_Fecha: ${dateStr}_\n\n` +
        `🏢 *Empresa / Razón Social:* ${company || 'Particular'}\n` +
        `👤 *Contacto:* ${name || 'No especificado'}\n` +
        `📄 *RUC / DNI:* ${doc || 'Por coordinar'}\n` +
        `📱 *Teléfono:* ${phone || 'Mismo número de WhatsApp'}\n` +
        `📍 *Destino / Obra:* ${city || 'Huancayo / Por coordinar'}\n` +
        (email ? `✉️ *Correo:* ${email}\n` : '') +
        `🧵 *Bordado de Logo:* ${embroidery}\n\n` +
        `*PRENDAS A COTIZAR:*\n${itemsListText}\n` +
        `📦 *Total de prendas:* ${totalPrendas} unidades\n`;

    if (notes) {
        message += `\n📝 *Observaciones:* ${notes}\n`;
    }

    message += `\nSolicito proforma formal indicando precios por volumen, opciones de tela y tiempo de confección. ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/51961841762?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

window.handlePrintProforma = () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Su lista de cotización está vacía.");
        return;
    }

    // Actualizar campos de la vista imprimible
    const company = (document.getElementById('quote-company')?.value || 'CLIENTE EMPRESARIAL').toUpperCase();
    const doc = document.getElementById('quote-doc')?.value || '-';
    const contact = document.getElementById('quote-name')?.value || '-';
    const city = document.getElementById('quote-city')?.value || 'Huancayo / Perú';

    const printClientEl = document.getElementById('print-client-name');
    const printDocEl = document.getElementById('print-client-doc');
    const printCityEl = document.getElementById('print-client-city');
    const printContactEl = document.getElementById('print-client-contact');

    if (printClientEl) printClientEl.textContent = company;
    if (printDocEl) printDocEl.textContent = doc;
    if (printCityEl) printCityEl.textContent = city;
    if (printContactEl) printContactEl.textContent = contact;

    window.print();
};

document.addEventListener('DOMContentLoaded', () => {
    renderCheckout();

    window.addEventListener('quote:updated', () => {
        renderCheckout();
    });

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.handleSendWhatsAppQuote(e);
        });
    }
});

