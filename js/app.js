/* =========================================================
   app.js — funções usadas em TODAS as páginas
   (formatar preço, cabeçalho, busca, menu do celular e cards)
   ========================================================= */

// 1234.5 -> "R$ 1.234,50"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Calcula a porcentagem de desconto (ex.: -37%)
function porcentagemDesconto(produto) {
  if (!produto.precoAntigo) return 0;
  return Math.round((1 - produto.preco / produto.precoAntigo) * 100);
}

// Desenha estrelas de 1 a 5 a partir da nota (ex.: 4.6 -> ★★★★★)
function estrelas(nota) {
  const cheias = Math.round(nota);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

// Atualiza o número vermelho em cima do ícone do carrinho
function atualizarContadorCarrinho() {
  document.querySelectorAll(".contador-carrinho").forEach((el) => {
    const total = totalDeItens();
    el.textContent = total;
    el.hidden = total === 0;
  });
}

// Mostra uma mensagem rápida no canto da tela (ex.: "Adicionado ao carrinho")
function mostrarAviso(texto) {
  let aviso = document.querySelector(".aviso");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "aviso";
    aviso.setAttribute("role", "status");
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("visivel");
  clearTimeout(aviso.timer);
  aviso.timer = setTimeout(() => aviso.classList.remove("visivel"), 2500);
}

/* Cria o HTML de um card de produto.
   É usado na página inicial e na página de produtos. */
function criarCardProduto(produto) {
  const desconto = porcentagemDesconto(produto);
  return `
    <article class="card-produto">
      <a href="produto.html?id=${produto.id}" class="card-produto__link">
        <div class="card-produto__foto">
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
          ${desconto ? `<span class="selo-desconto">-${desconto}%</span>` : ""}
        </div>
        <span class="card-produto__marca">${produto.marca}</span>
        <h3 class="card-produto__nome">${produto.nome}</h3>
        <p class="card-produto__descricao">${produto.descricao}</p>
        <span class="card-produto__nota"><span class="estrelas">${estrelas(produto.avaliacao)}</span> ${produto.avaliacao.toString().replace(".", ",")} (${produto.numAvaliacoes})</span>
        ${produto.precoAntigo ? `<span class="preco-antigo">${formatarPreco(produto.precoAntigo)}</span>` : ""}
        <strong class="preco">${formatarPreco(produto.preco)}</strong>
        <span class="preco-pix">${formatarPreco(produto.preco * 0.95)} no Pix</span>
      </a>
      <button class="botao botao--secundario botao--pequeno" data-adicionar="${produto.id}">Adicionar ao carrinho</button>
    </article>`;
}

/* Liga os botões "Adicionar ao carrinho" dos cards.
   Do card, adiciona com o primeiro tamanho disponível;
   na página do produto a pessoa pode escolher o tamanho. */
function ativarBotoesAdicionar(container) {
  container.querySelectorAll("[data-adicionar]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const produto = buscarProduto(botao.dataset.adicionar);
      adicionarAoCarrinho(produto.id, produto.tamanhos[0], 1);
      mostrarAviso(`${produto.nome} (tam. ${produto.tamanhos[0]}) adicionado ao carrinho`);
    });
  });
}

// Menu do celular (botão ☰) e marcação do link da página atual
function iniciarCabecalho() {
  const botaoMenu = document.querySelector(".botao-menu");
  const menu = document.querySelector(".menu");
  if (botaoMenu) {
    botaoMenu.addEventListener("click", () => {
      const aberto = menu.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", aberto);
    });
  }

  // A busca do cabeçalho leva para a página de produtos com o termo na URL
  const formBusca = document.querySelector(".busca");
  if (formBusca) {
    const params = new URLSearchParams(location.search);
    formBusca.q.value = params.get("q") || "";
  }

  atualizarContadorCarrinho();
}

document.addEventListener("DOMContentLoaded", iniciarCabecalho);
