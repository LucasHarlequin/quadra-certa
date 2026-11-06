/* pagina-produto.js — página de detalhes de um produto
   O produto é escolhido pelo id na URL: produto.html?id=precision-7 */

const id = new URLSearchParams(location.search).get("id");
const produto = buscarProduto(id) || PRODUTOS[0];
let tamanhoEscolhido = produto.tamanhos.length === 1 ? produto.tamanhos[0] : null;

// Atalho para trocar o texto de um elemento pelo id
const preencher = (seletor, texto) => (document.querySelector(seletor).textContent = texto);

// 1) Informações principais
document.title = `${produto.nome} | Quadra Certa`;
document.querySelector("#produto-imagem").src = produto.imagem;
document.querySelector("#produto-imagem").alt = produto.nome;
preencher("#produto-marca", produto.marca);
preencher("#produto-nome", produto.nome);
preencher("#migalha-produto", produto.nome);
preencher("#produto-estrelas", estrelas(produto.avaliacao));
preencher("#produto-avaliacoes", `${produto.avaliacao.toString().replace(".", ",")} · ${produto.numAvaliacoes} avaliações`);
preencher("#produto-preco", formatarPreco(produto.preco));
preencher("#produto-pix", `${formatarPreco(produto.preco * 0.95)} no Pix (5% off)`);
preencher("#produto-parcelas", `ou 10x de ${formatarPreco(produto.preco / 10)} sem juros no cartão`);
preencher("#produto-descricao", produto.descricao);

const categoria = CATEGORIAS.find((c) => c.id === produto.categoria);
const linkCategoria = document.querySelector("#migalha-categoria");
linkCategoria.textContent = categoria.nome;
linkCategoria.href = `produtos.html?cat=${categoria.id}`;

if (produto.precoAntigo) {
  preencher("#produto-preco-antigo", formatarPreco(produto.precoAntigo));
  const selo = document.querySelector("#produto-selo");
  selo.hidden = false;
  selo.textContent = `-${porcentagemDesconto(produto)}%`;
}

// 2) Botões de tamanho
const caixaTamanhos = document.querySelector("#tamanhos");
caixaTamanhos.innerHTML = produto.tamanhos
  .map((t) => `<button type="button" class="tamanho" data-tamanho="${t}">${t}</button>`)
  .join("");

function marcarTamanho(tamanho) {
  tamanhoEscolhido = tamanho;
  preencher("#tamanho-escolhido", tamanho);
  document.querySelector("#erro-tamanho").hidden = true;
  caixaTamanhos.querySelectorAll(".tamanho").forEach((b) => {
    b.classList.toggle("selecionado", b.dataset.tamanho === tamanho);
  });
}
caixaTamanhos.addEventListener("click", (evento) => {
  if (evento.target.dataset.tamanho) marcarTamanho(evento.target.dataset.tamanho);
});
if (tamanhoEscolhido) marcarTamanho(tamanhoEscolhido);

// 3) Quantidade (botões − e +)
const campoQtd = document.querySelector("#qtd");
const ajustarQtd = (valor) => (campoQtd.value = Math.min(5, Math.max(1, valor)));
document.querySelector("#qtd-menos").addEventListener("click", () => ajustarQtd(Number(campoQtd.value) - 1));
document.querySelector("#qtd-mais").addEventListener("click", () => ajustarQtd(Number(campoQtd.value) + 1));
campoQtd.addEventListener("change", () => ajustarQtd(Number(campoQtd.value) || 1));

// 4) Adicionar ao carrinho / Comprar agora
function adicionar() {
  if (!tamanhoEscolhido) {
    document.querySelector("#erro-tamanho").hidden = false;
    return false;
  }
  adicionarAoCarrinho(produto.id, tamanhoEscolhido, Number(campoQtd.value));
  return true;
}
document.querySelector("#botao-adicionar").addEventListener("click", () => {
  if (adicionar()) mostrarAviso(`${produto.nome} adicionado ao carrinho`);
});
document.querySelector("#botao-comprar").addEventListener("click", () => {
  if (adicionar()) location.href = "carrinho.html";
});

// 5) Cálculo de frete simulado pelo CEP
const campoCep = document.querySelector("#cep-frete");
campoCep.addEventListener("input", () => (campoCep.value = mascaraCep(campoCep.value)));
document.querySelector("#form-frete").addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede a página de recarregar
  const numeros = campoCep.value.replace(/\D/g, "");
  const resultado = document.querySelector("#resultado-frete");
  if (numeros.length !== 8) {
    resultado.textContent = "Digite um CEP com 8 números.";
    return;
  }
  // Simulação: o prazo depende da região (primeiro número do CEP)
  const dias = 3 + (Number(numeros[0]) % 5);
  const valor = produto.preco >= FRETE_GRATIS_A_PARTIR ? "Frete grátis" : `Frete ${formatarPreco(VALOR_FRETE)}`;
  resultado.textContent = `🚚 ${valor} · entrega em até ${dias} dias úteis`;
});

function mascaraCep(texto) {
  return texto.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

// 6) Avaliações (exemplos fixos)
const avaliacoes = [
  { nome: "Rafael M.", nota: 5, texto: "Chegou antes do prazo e o tamanho ficou perfeito. Recomendo!" },
  { nome: "Juliana S.", nota: 4, texto: "Produto original e bem embalado. Só demorou um pouco para despachar." },
  { nome: "Pedro A.", nota: 5, texto: "Ótima qualidade, uso nos treinos três vezes por semana." },
];
document.querySelector("#lista-avaliacoes").innerHTML = avaliacoes.map((a) => `
  <article class="avaliacao">
    <span class="estrelas">${estrelas(a.nota)}</span>
    <p>"${a.texto}"</p>
    <small>${a.nome} · Compra verificada</small>
  </article>`).join("");

// 7) Produtos relacionados: mesma categoria, sem repetir o atual
const relacionados = PRODUTOS.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, 4);
const gradeRelacionados = document.querySelector("#relacionados");
gradeRelacionados.innerHTML = relacionados.map(criarCardProduto).join("");
ativarBotoesAdicionar(gradeRelacionados);
