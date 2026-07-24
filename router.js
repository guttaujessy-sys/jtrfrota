// ======================================
// JTR FROTAS v2.0 - router.js
// Roteador de Páginas/Componentes
// ======================================

import * as db from './database.js';

const routes = {
    '/dashboard': renderDashboard,
    '/motoristas': renderMotoristas,
    '/caminhoes': renderCaminhoes,
    '/clientes': renderClientes,
    '/viagens': renderViagens,
    '/financeiro': renderFinanceiro,
    '/manutencoes': renderManutencoes
};

export function handleRoute() {
    const hash = window.location.hash || '#/dashboard';
    const path = hash.replace('#', '');
    const renderFn = routes[path] || renderDashboard;
    
    // Atualiza links visuais no menu
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('href') === hash);
    });

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const titleText = path.replace('/', '').toUpperCase();
        pageTitle.innerText = titleText || 'DASHBOARD';
    }

    renderFn();
}

async function renderDashboard() {
    const container = document.getElementById('view-container');
    const motoristas = await db.getAll('motoristas');
    const caminhoes = await db.getAll('caminhoes');
    const viagens = await db.getAll('viagens');

    container.innerHTML = `
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-title">Motoristas Cadastrados</div>
                <div class="kpi-value">${motoristas.length}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Caminhões na Frota</div>
                <div class="kpi-value">${caminhoes.length}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Viagens Realizadas</div>
                <div class="kpi-value">${viagens.length}</div>
            </div>
        </div>
        <div class="card">
            <h3>Bem-vindo ao JTR Frotas ERP</h3>
            <p style="margin-top:10px; color: var(--text-muted);">
                Sistema modular de gestão de frota. Navegue pelo menu lateral para gerenciar cada setor.
            </p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

async function renderMotoristas() {
    const container = document.getElementById('view-container');
    const lista = await db.getAll('motoristas');

    let rows = lista.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.nome}</td>
            <td>${m.cnh || '-'}</td>
            <td>${m.telefone || '-'}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>Cadastro de Motoristas</h3>
                <button class="btn" id="btn-novo-motorista">+ Novo Motorista</button>
            </div>
            <table>
                <thead>
                    <tr><th>ID</th><th>Nome</th><th>CNH</th><th>Telefone</th></tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="4">Nenhum motorista cadastrado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('btn-novo-motorista')?.addEventListener('click', async () => {
        const nome = prompt("Nome do Motorista:");
        if (nome) {
            const cnh = prompt("Número da CNH:");
            await db.add('motoristas', { nome, cnh });
            renderMotoristas();
        }
    });
}

async function renderCaminhoes() {
    const container = document.getElementById('view-container');
    const lista = await db.getAll('caminhoes');

    let rows = lista.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.placa}</td>
            <td>${c.modelo || '-'}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>Frota de Caminhões</h3>
                <button class="btn" id="btn-novo-caminhao">+ Novo Caminhão</button>
            </div>
            <table>
                <thead>
                    <tr><th>ID</th><th>Placa</th><th>Modelo</th></tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="3">Nenhum caminhão cadastrado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('btn-novo-caminhao')?.addEventListener('click', async () => {
        const placa = prompt("Placa do Caminhão:");
        if (placa) {
            const modelo = prompt("Modelo/Marca:");
            await db.add('caminhoes', { placa, modelo });
            renderCaminhoes();
        }
    });
}

function renderClientes() {
    document.getElementById('view-container').innerHTML = `<div class="card"><h3>Módulo de Clientes em breve</h3></div>`;
}

function renderViagens() {
    document.getElementById('view-container').innerHTML = `<div class="card"><h3>Módulo de Viagens em breve</h3></div>`;
}

function renderFinanceiro() {
    document.getElementById('view-container').innerHTML = `<div class="card"><h3>Módulo Financeiro em breve</h3></div>`;
}

function renderManutencoes() {
    document.getElementById('view-container').innerHTML = `<div class="card"><h3>Módulo de Manutenções em breve</h3></div>`;
}
