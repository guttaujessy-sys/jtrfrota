// ======================================
// JTR FROTAS v2.0 - database.js
// Banco de Dados IndexedDB
// ======================================

const DB_NAME = "JTRFrotasDB";
const DB_VERSION = 1;
let db = null;

export async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            db = request.result;
            console.log("Banco IndexedDB conectado com sucesso.");
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            createStore("usuarios");
            createStore("motoristas");
            createStore("caminhoes");
            createStore("clientes");
            createStore("viagens");
            createStore("abastecimentos");
            createStore("despesas");
            createStore("recebimentos");
            createStore("manutencoes");
            createStore("pneus");
            createStore("documentos");
            createStore("configuracoes");
        };
    });
}

function createStore(name) {
    if (db.objectStoreNames.contains(name)) return;
    const store = db.createObjectStore(name, {
        keyPath: "id",
        autoIncrement: true
    });
    store.createIndex("createdAt", "createdAt", { unique: false });
}

export async function add(storeName, data) {
    return new Promise((resolve, reject) => {
        data.createdAt = new Date().toISOString();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.add(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function update(storeName, data) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export async function remove(storeName, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export async function getAll(storeName) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getById(storeName, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
