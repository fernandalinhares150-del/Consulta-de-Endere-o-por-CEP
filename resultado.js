// Pega os parâmetros que foram enviados pela página anterior
const parametros = new URLSearchParams(window.location.search);


// Pega o CEP que está na URL
// Se não existir, deixa vazio
const cep = parametros.get("cep") || "";


// Pega a cidade que está na URL
const cidadeInformada = parametros.get("cidade") || "";


// Pega a área onde os resultados serão mostrados
const resultado = document.getElementById("resultado");


// Pega o link do Google Maps
const linkMaps = document.getElementById("linkMaps");


// Função usada para facilitar a comparação dos nomes das cidades
function normalizar(texto) {

    return texto
        // Separa as letras dos acentos
        .normalize("NFD")

        // Remove os acentos
        .replace(/[\u0300-\u036f]/g, "")

        // Converte tudo para letras minúsculas
        .toLowerCase()

        // Remove espaços extras
        .trim()
        .replace(/\s+/g, " ");
}


// Função que mostra uma informação do endereço
function mostrarCampo(rotulo, valor) {

    // Cria um novo parágrafo
    const linha = document.createElement("p");

    // Cria um elemento para colocar o título em negrito
    const titulo = document.createElement("strong");


    // Coloca o nome do campo
    titulo.textContent = `${rotulo}: `;


    // Adiciona o título e o valor
    // Se não houver valor, mostra "Não informado"
    linha.append(titulo, valor || "Não informado");


    // Coloca o parágrafo na página
    resultado.append(linha);
}


// Função que consulta o endereço na API
async function consultarEndereco() {

    // Esconde o botão do Google Maps inicialmente
    linkMaps.hidden = true;


    // Verifica se o CEP e a cidade são válidos
    if (!/^\d{8}$/.test(cep) || !cidadeInformada.trim()) {

        // Mostra uma mensagem de erro
        resultado.textContent =
            "Dados inválidos. Volte e informe CEP e cidade.";

        // Para a função
        return;
    }


    // Mostra uma mensagem enquanto consulta
    resultado.textContent = "Consultando endereço...";


    // Cria um controlador para cancelar a consulta
    const controle = new AbortController();


    // Define um limite de 10 segundos para a consulta
    const limite = setTimeout(() => controle.abort(), 10000);


    try {

        // Consulta a API ViaCEP
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            {
                signal: controle.signal
            }
        );


        // Verifica se houve algum erro na resposta
        if (!resposta.ok) {
            throw new Error("Falha HTTP");
        }


        // Converte a resposta da API para JSON
        const dados = await resposta.json();


        // Verifica se o CEP não foi encontrado
        if (dados.erro) {

            resultado.textContent = "CEP não encontrado.";

            return;
        }


        // Verifica se os dados principais foram encontrados
        if (!dados.localidade || !dados.uf || !dados.cep) {

            throw new Error("Resposta incompleta");
        }


        // Compara a cidade digitada com a cidade retornada pela API
        if (
            normalizar(cidadeInformada) !==
            normalizar(dados.localidade)
        ) {

            // Informa que o CEP pertence a outra cidade
            resultado.textContent =
                `Este CEP pertence a ${dados.localidade}/${dados.uf}, ` +
                `e não a ${cidadeInformada}. Faça uma nova consulta.`;

            return;
        }


        // Limpa resultados anteriores
        resultado.replaceChildren();


        // Lista com as informações do endereço
        const campos = [

            ["CEP", dados.cep],

            ["Logradouro", dados.logradouro],

            ["Complemento", dados.complemento],

            ["Bairro", dados.bairro],

            ["Cidade", dados.localidade],

            ["Estado", dados.estado],

            ["UF", dados.uf]
        ];


        // Percorre todos os campos
        campos.forEach(([rotulo, valor]) => {

            // Mostra cada informação na página
            mostrarCampo(rotulo, valor);

        });


        // Junta todas as informações para formar o endereço completo
        const endereco = [

            dados.logradouro,
            dados.complemento,
            dados.bairro,
            dados.localidade,
            dados.estado,
            dados.uf,
            dados.cep

        ]

            // Remove os campos vazios
            .filter(Boolean)

            // Junta tudo usando vírgulas
            .join(", ");


        // Mostra o endereço completo
        mostrarCampo(
            "Endereço completo disponível",
            endereco
        );


        // Prepara o endereço para ser usado no Google Maps
        const busca =
            encodeURIComponent(`${endereco}, Brasil`);


        // Cria o link de pesquisa do Google Maps
        linkMaps.href =
            `https://www.google.com/maps/search/?api=1&query=${busca}`;


        // Mostra o botão do Google Maps
        linkMaps.hidden = false;


    } catch (erro) {

        // Mostra uma mensagem de erro para o usuário
        resultado.textContent =
            erro.name === "AbortError"

                // Mensagem caso a consulta demore mais de 10 segundos
                ? "A consulta demorou demais. Tente novamente."

                // Mensagem para outros erros
                : "Não foi possível consultar. Verifique a conexão " +
                "e tente novamente.";

    } finally {

        // Cancela o temporizador
        clearTimeout(limite);
    }
}


// Executa a função quando a página é carregada
consultarEndereco();