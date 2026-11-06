/* =========================================================
   carrinho.js — toda a lógica do carrinho de compras
   O carrinho fica salvo no navegador (localStorage), então
   ele continua lá mesmo se a pessoa trocar de página ou
   fechar o site.
   Cada item do carrinho tem: { id, tamanho, quantidade }
   ========================================================= */

const CHAVE_CARRINHO = "quadraCerta_carrinho";
const LIMITE_POR_ITEM = 5;       // quantidade máxima de um mesmo produto
const FRETE_GRATIS_A_PARTIR = 299; // compras acima disso têm frete grátis
const VALOR_FRETE = 24.9;
const DESCONTO_PIX = 0.05;       // 5% de desconto no Pix
const CUPONS = { QUADRA10: 0.10, BASQUETE5: 0.05 }; // cupons válidos

// Lê o carrinho salvo. Se não existir nada, devolve uma lista vazia.
function obterCarrinho() {
  const texto = localStorage.getItem(CHAVE_CARRINHO);
  return texto ? JSON.parse(texto) : [];
}

// Salva o carrinho e atualiza o número que aparece no ícone do cabeçalho
function salvarCarrinho(carrinho) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

// Adiciona um produto. Se o mesmo produto/tamanho já existe, soma a quantidade.
function adicionarAoCarrinho(id, tamanho, quantidade = 1) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find((item) => item.id === id && item.tamanho === tamanho);

  if (existente) {
    existente.quantidade = Math.min(existente.quantidade + quantidade, LIMITE_POR_ITEM);
  } else {
    carrinho.push({ id, tamanho, quantidade: Math.min(quantidade, LIMITE_POR_ITEM) });
  }
  salvarCarrinho(carrinho);
}

// Muda a quantidade de um item (posição na lista). Quantidade 0 remove o item.
function alterarQuantidade(indice, novaQuantidade) {
  const carrinho = obterCarrinho();
  if (novaQuantidade <= 0) {
    carrinho.splice(indice, 1);
  } else {
    carrinho[indice].quantidade = Math.min(novaQuantidade, LIMITE_POR_ITEM);
  }
  salvarCarrinho(carrinho);
}

function removerDoCarrinho(indice) {
  const carrinho = obterCarrinho();
  carrinho.splice(indice, 1);
  salvarCarrinho(carrinho);
}

function limparCarrinho() {
  localStorage.removeItem(CHAVE_CARRINHO);
  localStorage.removeItem("quadraCerta_cupom");
  atualizarContadorCarrinho();
}

// Soma de todas as quantidades (ex.: 2 tênis + 1 bola = 3 itens)
function totalDeItens() {
  return obterCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
}

// Cupom salvo pelo cliente (ou null se não usou cupom)
function obterCupom() {
  return localStorage.getItem("quadraCerta_cupom");
}

function aplicarCupom(codigo) {
  codigo = codigo.trim().toUpperCase();
  if (CUPONS[codigo]) {
    localStorage.setItem("quadraCerta_cupom", codigo);
    return true;
  }
  return false;
}

/* Calcula todos os valores do pedido.
   formaPagamento pode ser "pix", "credito" ou "debito". */
function calcularTotais(formaPagamento = "") {
  const carrinho = obterCarrinho();

  // 1) Subtotal = preço de cada produto x quantidade
  const subtotal = carrinho.reduce((soma, item) => {
    const produto = buscarProduto(item.id);
    return soma + produto.preco * item.quantidade;
  }, 0);

  // 2) Desconto do cupom (porcentagem sobre o subtotal)
  const cupom = obterCupom();
  const descontoCupom = cupom ? subtotal * CUPONS[cupom] : 0;

  // 3) Frete: grátis acima do valor mínimo
  const frete = subtotal === 0 || subtotal >= FRETE_GRATIS_A_PARTIR ? 0 : VALOR_FRETE;

  // 4) Desconto do Pix (5% sobre o valor já com cupom)
  const descontoPix = formaPagamento === "pix" ? (subtotal - descontoCupom) * DESCONTO_PIX : 0;

  const total = subtotal - descontoCupom - descontoPix + frete;

  return { subtotal, descontoCupom, descontoPix, frete, total, cupom };
}
