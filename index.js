// Verifica se o navegador possui suporte para Service Worker
if ("serviceWorker" in navigator) {

    // Registra o Service Worker da aplicação
    navigator.serviceWorker.register("./sw.js")

        // Mostra no console quando o registro funcionar
        .then(() => {
            console.log("Service Worker registrado com sucesso.");
        })

        // Mostra o erro caso não consiga registrar
        .catch((erro) => {
            console.log("Erro ao registrar o Service Worker:", erro);
        });
}


// Pega o formulário pelo ID
const form = document.getElementById("formConsulta");

// Pega o espaço onde as mensagens serão mostradas
const mensagem = document.getElementById("mensagem");


// Detecta quando o formulário é enviado
form.addEventListener("submit", (event) => {

    // Impede que a página seja recarregada
    event.preventDefault();


    // Pega o CEP digitado pelo usuário
    // trim() remove espaços extras
    const entrada = document.getElementById("cep").value.trim();


    // Pega a cidade digitada pelo usuário
    const cidade = document.getElementById("cidade")
        .value
        .trim()

        // Troca vários espaços seguidos por apenas um
        .replace(/\s+/g, " ");


    // Limpa mensagens anteriores
    mensagem.textContent = "";


    // Verifica se o CEP possui o formato correto
    if (!/^\d{5}-?\d{3}$/.test(entrada)) {

        // Mostra mensagem de erro
        mensagem.textContent = "Informe um CEP com 8 números.";

        // Para a execução
        return;
    }


    // Verifica se a cidade foi preenchida
    if (!cidade) {

        // Mostra mensagem de erro
        mensagem.textContent = "Informe a cidade.";

        // Para a execução
        return;
    }


    // Remove o hífen do CEP
    const cep = entrada.replace("-", "");


    // Cria os parâmetros que serão enviados para a próxima página
    const parametros = new URLSearchParams({
        cep,
        cidade
    });


    // Abre a página de resultado
    window.location.href = `resultado.html?${parametros}`;
});