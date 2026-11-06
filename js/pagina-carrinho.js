/* pagina-carrinho.js — mostra os itens, altera quantidade, remove e calcula o total */

const listaItens = document.querySelector("#itens-carrinho");

function desenharCarrinho() {
  const carrinho = obterCarrinho();
  const vazio = carrinho.length === 0;

  document.querySelector("#carrinho-vazio").hidden = !vazio;
  document.querySelector("#carrinho-cheio").hidden = vazio;
  const qtd = totalDeItens();
  document.querySelector("#qtd-itens").textContent = vazio ? "" : `(${qtd} ${qtd === 1 ? "item" : "itens"})`;
  if (vazio) return;

  // 1) Lista de itens
  listaItens.innerHTML = carrinho.map((item, indice) => {
    const produto = buscarProduto(item.id);
    return `
      <li class="item-carrinho">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="item-carrinho__info">
          <a href="produto.html?id=${produto.id}"><b>${produto.nome}</b></a>
          <small>Tamanho ${item.tamanho} · ${formatarPreco(produto.preco)} cada</small>
          <div class="item-carrinho__acoes">
            <div class="quantidade quantidade--pequena">
              <button type="button" data-acao="menos" data-indice="${indice}" aria-label="Diminuir">−</button>
              <span>${item.quantidade}</span>
              <button type="button" data-acao="mais" data-indice="${indice}" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="link link--perigo" data-acao="remover" data-indice="${indice}">🗑 Remover</button>
          </div>
        </div>
        <strong class="item-carrinho__total">${formatarPreco(produto.preco * item.quantidade)}</strong>
      </li>`;
  }).join("");

  // 2) Resumo com os valores calculados em carrinho.js
  const totais = calcularTotais();
  document.querySelector("#resumo-linhas").innerHTML = `
    <dt>Subtotal</dt><dd>${formatarPreco(totais.subtotal)}</dd>
    ${totais.cupom ? `<dt>Cupom ${totais.cupom}</dt><dd class="verde">- ${formatarPreco(totais.descontoCupom)}</dd>` : ""}
    <dt>Frete</dt><dd class="${totais.frete ? "" : "verde"}">${totais.frete ? formatarPreco(totais.frete) : "Grátis"}</dd>`;
  document.querySelector("#total").textContent = formatarPreco(totais.total);
  document.querySelector("#total-pix").textContent = `ou ${formatarPreco(calcularTotais("pix").total)} no Pix`;
  if (totais.frete) {
    const falta = FRETE_GRATIS_A_PARTIR - totais.subtotal;
    document.querySelector("#total-pix").textContent += ` · faltam ${formatarPreco(falta)} para frete grátis`;
  }
}

// Um único "ouvinte" de clique para todos os botões da lista (delegação de eventos)
listaItens.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button");
  if (!botao) return;
  const indice = Number(botao.dataset.indice);
  const item = obterCarrinho()[indice];

  if (botao.dataset.acao === "mais") {
    if (item.quantidade >= LIMITE_POR_ITEM) mostrarAviso(`Máximo de ${LIMITE_POR_ITEM} unidades por produto`);
    alterarQuantidade(indice, item.quantidade + 1);
  }
  if (botao.dataset.acao === "menos") alterarQuantidade(indice, item.quantidade - 1);
  if (botao.dataset.acao === "remover") {
    removerDoCarrinho(indice);
    mostrarAviso("Produto removido do carrinho");
  }
  desenharCarrinho();
});

// Cupom de desconto
document.querySelector("#form-cupom").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const campo = document.querySelector("#campo-cupom");
  const mensagem = document.querySelector("#msg-cupom");
  if (aplicarCupom(campo.value)) {
    mensagem.textContent = `Cupom ${campo.value.toUpperCase()} aplicado!`;
    mensagem.className = "verde";
  } else {
    mensagem.textContent = "Cupom inválido.";
    mensagem.className = "erro";
  }
  desenharCarrinho();
});

desenharCarrinho();
