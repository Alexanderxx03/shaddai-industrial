export const CATALOG_STRUCTURE = {
    "ROPAS INDUSTRIALES": [
        "Mamelucos Térmicos", "Pantalones Cargo Drill", "Casacas Térmicas Impermeables", 
        "Camisas de Trabajo Drill", "Chalecos Tipo Geólogo 3M", "Polos Camiseros Piqué", "Guardapolvos de Taller"
    ],
    "UNIFORMES DE SEGURIDAD": [
        "Chalecos Alta Visibilidad ANSI", "Casacas Cortaviento", "Pantalones con Cintas 3M", "Camisas Drill Seguridad", "Gorros con Cubrenuca"
    ],
    "MINERÍA Y CONSTRUCCIÓN": [
        "Mamelucos Ignífugos / Térmicos", "Casacas Bicolor con Cinta Reflectiva", "Chalecos Multibolsillos Acolchados", "Pantalones con Rodilleras Reforzadas"
    ],
    "ROPAS DE LIMPIEZA Y SALUD": [
        "Mandiles Impermeables de PVC", "Chaquetas Clínicas", "Pantalones Sanitarios", "Batas de Laboratorio"
    ],
    "ROPAS CORPORATIVAS Y PUBLICITARIAS": [
        "Camisas Oxford Manga Larga", "Blusas Oxford Ejecutivas", "Polos Publicitarios Cuello Redondo", "Gorros Publicitarios con Bordado 3D"
    ]
};

const mapImage = (sub, mainCat) => {
    const s = sub.toLowerCase();
    if (s.includes("mameluco") || s.includes("overol")) return "img/overol.jpg";
    if (s.includes("casaca")) return "img/casaca-portada.png";
    if (s.includes("chaleco")) return "img/chaleco.webp";
    if (s.includes("camisa") || s.includes("blusa")) return "img/camisas.jpg";
    if (s.includes("pantalon")) return "img/textil-seguridad.jpg";
    if (s.includes("bordado") || s.includes("gorro")) return "img/bordado-industrial.jpg";
    if (s.includes("minería") || s.includes("ignífugo")) return "img/operarios-mineria.jpg";
    if (s.includes("taller") || s.includes("guardapolvo")) return "img/taller-confeccion.jpg";
    return "img/casaca-portada.png";
};

const getSpecs = (sub) => {
    const s = sub.toLowerCase();
    if (s.includes("mameluco")) {
        return "Tela Drill San Jacinto / Nuevo Mundo 100% algodón o mezcla pesada. Costura triple reforzada en zonas de mayor fricción, cierre de doble corredera y cintas reflectivas 3M de 2 pulgadas.";
    }
    if (s.includes("chaleco")) {
        return "Confección en drill pesado con forro interior de malla transpirable. Cintas reflectivas de alta visibilidad grado industrial según norma ANSI/ISEA 107, múltiples bolsillos porta-radio y credencial.";
    }
    if (s.includes("casaca")) {
        return "Exterior en tela Taslan impermeable o drill pesado con forro polar térmico interior. Cintura y puños elásticos o ajustables, bolsillos térmicos y tapeta con broches metálicos a presión.";
    }
    if (s.includes("camisa") || s.includes("pantalon")) {
        return "Tela drill de alta resistencia al desgarro y desgaste continuo. Atraques en bolsillos y tiro, botones de pasta de alta duración o broches inoxidables. Ideal para faenas exigentes.";
    }
    if (s.includes("oxford")) {
        return "Tela Oxford de excelente caída, fresca y resistente al arrugado. Cuello camisero fusionado, acabados finos y entallado ejecutivo para damas y caballeros.";
    }
    return "Confección directa en taller con costuras de alta resistencia y acabados corporativos. Apto para personalización con bordado computarizado de logotipo.";
};

export const getProducts = async (categoryFilter = null) => {
    let products = [];
    let id_counter = 1;

    for (const [mainCat, subCats] of Object.entries(CATALOG_STRUCTURE)) {
        for (const sub of subCats) {
            products.push({
                id: String(id_counter),
                name: `${sub}`,
                mainCategory: mainCat,
                subCategory: sub,
                price: 45.00 + ((id_counter % 8) * 8), // Precio referencial
                priceLabel: "Cotizar por Mayor / Menor",
                sizes: ["S", "M", "L", "XL", "XXL", "A Medida"],
                fabric: "Drill Nacional / Taslan / Oxford según requerimiento",
                stockLabel: "Fabricación a Pedido y Stock Inmediato",
                image: mapImage(sub, mainCat),
                description: getSpecs(sub)
            });
            id_counter++;
        }
    }

    if (categoryFilter) {
        products = products.filter(p => p.mainCategory === categoryFilter || p.subCategory === categoryFilter);
    }

    return products;
};

export const getCatalogStructure = () => {
    return CATALOG_STRUCTURE;
};

export const getProductById = async (id) => {
    const products = await getProducts();
    return products.find(p => p.id === id);
};
