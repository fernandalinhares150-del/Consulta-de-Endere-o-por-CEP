// Nome do cache da aplicação
const CACHE_NAME = "consulta-cep-v1";


// Arquivos principais que serão salvos no cache
const ARQUIVOS_PARA_CACHE = [

    // Página inicial
    "./",

    // Arquivo HTML principal
    "./index.html",

    // Arquivo CSS
    "./style.css",

    // JavaScript da página inicial
    "./index.js",

    // Página de resultado
    "./resultado.html",

    // JavaScript da página de resultado
    "./resultado.js",

    // Manifesto da PWA
    "./manifest.json",

    // Ícone de 192x192
    "./icons/icon-192.png",

    // Ícone de 512x512
    "./icons/icon-512.png"
];


// Evento executado quando o Service Worker é instalado
self.addEventListener("install", (event) => {

    // Abre o cache da aplicação
    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                // Salva os arquivos no cache
                return cache.addAll(ARQUIVOS_PARA_CACHE);
            })
    );
});


// Evento executado quando a página faz uma requisição
self.addEventListener("fetch", (event) => {

    // Primeiro procura o arquivo no cache
    event.respondWith(

        caches.match(event.request)
            .then((resposta) => {

                // Se encontrar no cache, usa o arquivo salvo
                if (resposta) {
                    return resposta;
                }

                // Se não encontrar, busca pela internet
                return fetch(event.request);
            })
    );
});