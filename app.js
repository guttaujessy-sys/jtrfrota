// ======================================
// JTR FROTAS v2.0 - app.js
// Inicializador da Aplicação
// ======================================

import { initDatabase } from './database.js';
import { handleRoute } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDatabase();
        
        // Inicializar rotas
        window.addEventListener('hashchange', handleRoute);
        handleRoute();

        // Inicializar ícones se disponível
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (err) {
        console.error("Erro ao inicializar a aplicação:", err);
    }
});
