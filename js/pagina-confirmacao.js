/* pagina-confirmacao.js — mostra o pedido que acabou de ser feito */

const pedido = JSON.parse(localStorage.getItem("quadraCerta_ultimoPedido"));

if (!pedido) {
  document.querySelector("#confirmacao").hidden = true;
  document.querySelector("#sem-pedido").hidden = false;
} else {
  document.querySelector("#nome-cliente").textContent = pedido.cliente.nome.split(" ")[0];
  document.querySelector("#email-cliente").textContent = pedido.cliente.email;
  document.querySelector("#numero-pedido").textContent = `#${pedido.numero} · ${pedido.data}`;
  document.querySelector("#endereco").textContent = "Entrega: " + pedido.endereco;

  const t = pedido.totais;
  document.querySelector("#resumo-itens").innerHTML = pedido.itens.map((item) => {
    const p = buscarProduto(item.id);
    return `<li><img src="${p.imagem}" alt=""><span>${item.quantidade}x ${p.nome}<small>Tam. ${item.tamanho}</small></span><b>${formatarPreco(p.preco * item.quantidade)}</b></li>`;
  }).join("");
  document.querySelector("#resumo-linhas").innerHTML = `
    <dt>Subtotal</dt><dd>${formatarPreco(t.subtotal)}</dd>
    ${t.cupom ? `<dt>Cupom ${t.cupom}</dt><dd class="verde">- ${formatarPreco(t.descontoCupom)}</dd>` : ""}
    ${t.descontoPix ? `<dt>Desconto Pix</dt><dd class="verde">- ${formatarPreco(t.descontoPix)}</dd>` : ""}
    <dt>Frete</dt><dd>${t.frete ? formatarPreco(t.frete) : "Grátis"}</dd>`;
  document.querySelector("#total").textContent = formatarPreco(t.total);

  // Informação diferente para cada forma de pagamento
  const caixa = document.querySelector("#pagamento-info");
  if (pedido.pagamento === "pix") {
    const codigo = "00020126580014BR.GOV.BCB.PIX0136" + pedido.numero + "QUADRACERTA5204000053039865802BR";
    caixa.innerHTML = `
      <h2>Pague com Pix</h2>
      <div class="pix">
        <div class="qr" id="qr"></div>
        <div>
          <p>Valor: <b>${formatarPreco(t.total)}</b></p>
          <p class="texto-suave">Abra o app do seu banco, escolha Pix e escaneie o código (simulação).</p>
          <input class="codigo-pix" value="${codigo}" readonly aria-label="Código Pix copia e cola">
          <button class="botao botao--escuro botao--pequeno" id="copiar">Copiar código Pix</button>
        </div>
      </div>`;
    desenharQrFalso(document.querySelector("#qr"), pedido.numero);
    document.querySelector("#copiar").addEventListener("click", () => {
      navigator.clipboard.writeText(codigo);
      mostrarAviso("Código Pix copiado!");
    });
  } else {
    const tipo = pedido.pagamento === "credito" ? "Cartão de crédito" : "Cartão de débito";
    const parcelas = pedido.parcelas > 1 ? `${pedido.parcelas}x de ${formatarPreco(t.total / pedido.parcelas)} sem juros` : "à vista";
    caixa.innerHTML = `<h2>Pagamento aprovado ✔</h2><p>${tipo} final <b>${pedido.finalCartao}</b> · ${parcelas}</p>`;
  }
}

// Desenha um "QR Code" ilustrativo (quadradinhos aleatórios a partir do número do pedido)
function desenharQrFalso(elemento, semente) {
  let n = Number(semente.replace(/\D/g, ""));
  const aleatorio = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  let html = "";
  for (let linha = 0; linha < 21; linha++) {
    for (let coluna = 0; coluna < 21; coluna++) {
      const canto = (linha < 7 && coluna < 7) || (linha < 7 && coluna > 13) || (linha > 13 && coluna < 7);
      const preto = canto ? [0, 6].includes(linha % 14) || [0, 6].includes(coluna % 14) || ((linha % 14) > 1 && (linha % 14) < 5 && (coluna % 14) > 1 && (coluna % 14) < 5) : aleatorio() > 0.5;
      html += `<i class="${preto ? "preto" : ""}"></i>`;
    }
  }
  elemento.innerHTML = html;
}
