import { getProducts, getCatalogStructure } from './products.service.js';
import { addToCart, getCart } from './cart.service.js';

let allProducts = [];
let selectedCategories = []; // Allows both mainCategory and subCategory selections
let searchQuery = '';

const updateCartBadge = () => {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const cart = getCart();
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.innerText = totalItems;
        if (totalItems > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
};

const renderCategoriesSidebar = () => {
    const container = document.getElementById('categories-sidebar');
    if (!container) return;

    const catalogStructure = getCatalogStructure();

    container.innerHTML = '';
    
    // Create nested accordion for mega menu structure
    Object.entries(catalogStructure).forEach(([mainCat, subCats], index) => {
        const isMainSelected = selectedCategories.includes(mainCat);
        const subSelectedCount = subCats.filter(sub => selectedCategories.includes(sub)).length;
        
        container.innerHTML += `
            <div class="border-b border-gray-100 last:border-0 pb-3 mb-3">
                <label class="flex items-center gap-3 cursor-pointer group mb-2">
                    <div class="relative flex items-center justify-center w-5 h-5">
                        <input type="checkbox" value="${mainCat}" class="category-checkbox peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-ind-blue checked:border-ind-blue transition-colors cursor-pointer" ${isMainSelected ? 'checked' : ''}>
                        <span class="material-symbols-outlined absolute text-white text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                    </div>
                    <span class="text-sm font-bold text-gray-700 group-hover:text-ind-blue transition-colors">
                        ${mainCat} 
                    </span>
                    <span class="ml-auto text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full font-bold">
                        ${subCats.length}
                    </span>
                </label>
                <div class="pl-8 flex flex-col gap-2 mt-1">
                    ${subCats.map(sub => {
                        const isSubSelected = selectedCategories.includes(sub);
                        return `
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative flex items-center justify-center w-4 h-4">
                                    <input type="checkbox" value="${sub}" class="category-checkbox peer appearance-none w-4 h-4 border-2 border-gray-200 rounded focus:ring-0 checked:bg-gray-800 checked:border-gray-800 transition-colors cursor-pointer" ${isSubSelected ? 'checked' : ''}>
                                    <span class="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                                </div>
                                <span class="text-[13px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                                    ${sub}
                                </span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });

    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(chk => {
        chk.addEventListener('change', (e) => {
            const val = e.target.value;
            if (e.target.checked) {
                selectedCategories.push(val);
            } else {
                selectedCategories = selectedCategories.filter(c => c !== val);
            }
            renderProductsGrid();
        });
    });
};

const renderProductsGrid = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <span class="material-symbols-outlined animate-spin text-4xl text-ind-blue-light mb-4">pageview</span>
            <p class="text-sm">Buscando prendas y equipos...</p>
        </div>
    `;

    let filtered = allProducts;

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.mainCategory) || selectedCategories.includes(p.subCategory));
    }

    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.mainCategory.toLowerCase().includes(q) ||
            p.subCategory.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 px-6 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white flex flex-col items-center">
                <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
                <h4 class="font-bold text-gray-800 text-lg mb-1">No se encontraron productos</h4>
                <p class="text-gray-500 text-sm max-w-sm">Prueba ajustando los filtros laterales o buscando con otras palabras clave.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const sizesHtml = item.sizes
            ? item.sizes.map(s => `<option value="${s}">${s}</option>`).join('')
            : '<option value="unica">Talla Única</option>';

        grid.innerHTML += `
            <div class="flex flex-col bg-white border border-gray-100 hover:border-ind-blue/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl group relative">
                <!-- Badge de confección -->
                <span class="absolute top-4 left-4 bg-[#080c16]/90 backdrop-blur-md text-ind-blue-light text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 border border-white/10">
                    ${item.stockLabel || 'Confección a Pedido'}
                </span>

                <!-- Imagen del Producto -->
                <div class="w-full h-56 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                    <img src="${item.image}" alt="${item.name}" 
                         class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" 
                         onerror="this.onerror=null; this.src='img/casaca-portada.png';" />
                </div>

                <!-- Detalles -->
                <div class="flex-grow flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1">
                            <span class="text-[10px] text-ind-blue font-extrabold uppercase tracking-widest block">
                                ${item.mainCategory}
                            </span>
                            <span class="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                                B2B / Mayorista
                            </span>
                        </div>
                        <h3 class="font-impact text-xl text-gray-900 uppercase tracking-wide mb-2 transition-colors group-hover:text-ind-blue">
                            ${item.name}
                        </h3>
                        <p class="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                            ${item.description}
                        </p>
                    </div>

                    <div class="mt-auto">
                        <!-- Selectores de Talla y Cantidad para Cotización -->
                        <div class="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-slate-100">
                            <div>
                                <label class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Talla</label>
                                <select id="size-${item.id}" class="w-full border border-gray-200 rounded-lg p-2 text-xs bg-slate-50 font-bold text-gray-700 outline-none focus:border-ind-blue focus:ring-1 focus:ring-ind-blue transition-all">
                                    ${sizesHtml}
                                </select>
                            </div>
                            <div>
                                <label class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Cantidad</label>
                                <input id="qty-${item.id}" type="number" min="1" value="12" class="w-full border border-gray-200 rounded-lg p-2 text-xs bg-slate-50 font-bold text-gray-700 outline-none focus:border-ind-blue focus:ring-1 focus:ring-ind-blue transition-all" title="Cantidad referencial a cotizar" />
                            </div>
                        </div>

                        <!-- Botones de Acción -->
                        <div class="flex flex-col gap-2">
                            <button onclick="window.handleAddToCart('${item.id}')" 
                                    class="w-full bg-[#0052cc] hover:bg-[#003c99] text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-xs uppercase tracking-wider">
                                <span class="material-symbols-outlined text-[17px]">playlist_add</span>
                                Agregar a Cotización
                            </button>
                            <button onclick="window.handleQuickWhatsApp('${item.id}')" 
                                    class="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs tracking-wider">
                                <span class="material-symbols-outlined text-[16px]">chat</span>
                                Cotizar por WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
};

window.handleAddToCart = async (productId) => {
    const product = allProducts.find(p => p.id === productId);
    const sizeSelect = document.getElementById(`size-${productId}`);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const size = sizeSelect ? sizeSelect.value : "M";
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

    if (product) {
        addToCart(product, size, qty);
        updateCartBadge();
        
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 right-6 bg-gray-900 text-white p-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 z-[100] translate-y-10 opacity-0 transition-all duration-300';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-[#00beff]">check_circle</span>
            <div class="text-xs">
                <p class="font-bold">Agregado a la Lista de Cotización</p>
                <p class="text-gray-400">${qty}x ${product.name} (Talla: ${size})</p>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);
        
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

window.handleQuickWhatsApp = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    const sizeSelect = document.getElementById(`size-${productId}`);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const size = sizeSelect ? sizeSelect.value : "M";
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

    if (!product) return;

    const message = `¡Hola Shaddai Industrial! Deseo solicitar una cotización formal para el siguiente producto:\n\n` +
        `• Prenda: *${product.name}*\n` +
        `• Categoría: ${product.mainCategory}\n` +
        `• Cantidad solicitada: *${qty} unidades*\n` +
        `• Talla referencial: *${size}*\n` +
        `• Especificación de confección: ${product.description}\n\n` +
        `Por favor indíquenme precio por volumen, opciones de bordado de logotipo y tiempo estimado de confección. ¡Muchas gracias!`;

    const url = `https://wa.me/51961841762?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

document.addEventListener('DOMContentLoaded', async () => {
    allProducts = await getProducts();
    renderCategoriesSidebar();
    renderProductsGrid();
    updateCartBadge();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProductsGrid();
        });
    }

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedCategories = [];
            const checkboxes = document.querySelectorAll('.category-checkbox');
            checkboxes.forEach(chk => chk.checked = false);
            renderProductsGrid();
            renderCategoriesSidebar();
        });
    }
});
