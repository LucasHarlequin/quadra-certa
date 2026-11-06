/* pagina-checkout.js — formulário do cliente, formas de pagamento e validação */

const form = document.querySelector("#form-checkout");

// Se o carrinho estiver vazio, não tem o que finalizar
if (obterCarrinho().length === 0) location.href = "carrinho.html";

// ---------- 1) Máscaras: formatam o texto enquanto a pessoa digita ----------
const mascaras = {
  telefone: (v) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2"),
  cpf: (v) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1-$2"),
  cep: (v) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
  "numero-cartao": (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
  validade: (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2"),
  cvv: (v) => v.replace(/\D/g, "").slice(0, 4),
};
Object.keys(mascaras).forEach((id) => {
  const campo = document.getElementById(id);
  campo.addEventListener("input", () => (campo.value = mascaras[id](campo.value)));
});

// ---------- 2) Forma de pagamento ----------
function formaEscolhida() {
  return form.pagamento.value; // "pix", "credito" ou "debito"
}

// Monta as opções de parcelamento: 1x a 10x sem juros (parcela mínima de R$ 30)
function montarParcelas() {
  const total = calcularTotais("credito").total;
  const seletor = document.querySelector("#parcelas");
  const escolhida = seletor.value || "1";
  seletor.innerHTML = "";
  for (let vezes = 1; vezes <= 10; vezes++) {
    if (vezes > 1 && total / vezes < 30) break;
    const texto = vezes === 1 ? `1x de ${formatarPreco(total)} (à vista)` : `${vezes}x de ${formatarPreco(total / vezes)} sem juros`;
    seletor.add(new Option(texto, vezes));
  }
  seletor.value = escolhida;
  if (!seletor.value) seletor.value = "1";
}

function atualizarPagamento() {
  const forma = formaEscolhida();
  document.querySelector("#area-pix").hidden = forma !== "pix";
  document.querySelector("#area-cartao").hidden = forma === "pix";
  document.querySelector("#campo-parcelas").hidden = forma !== "credito";
  montarParcelas();
  atualizarResumo();
}
form.addEventListener("change", (evento) => {
  if (evento.target.name === "pagamento") atualizarPagamento();
  if (evento.target.name === "parcelas") atualizarResumo();
});

// ---------- 3) Resumo do pedido (muda conforme a forma de pagamento) ----------
function atualizarResumo() {
  const forma = formaEscolhida();
  const totais = calcularTotais(forma);

  document.querySelector("#resumo-itens").innerHTML = obterCarrinho().map((item) => {
    const p = buscarProduto(item.id);
    return `<li><img src="${p.imagem}" alt=""><span>${item.quantidade}x ${p.nome}<small>Tam. ${item.tamanho}</small></span><b>${formatarPreco(p.preco * item.quantidade)}</b></li>`;
  }).join("");

  document.querySelector("#resumo-linhas").innerHTML = `
    <dt>Subtotal</dt><dd>${formatarPreco(totais.subtotal)}</dd>
    ${totais.cupom ? `<dt>Cupom ${totais.cupom}</dt><dd class="verde">- ${formatarPreco(totais.descontoCupom)}</dd>` : ""}
    ${forma === "pix" ? `<dt>Desconto Pix (5%)</dt><dd class="verde">- ${formatarPreco(totais.descontoPix)}</dd>` : ""}
    <dt>Frete</dt><dd class="${totais.frete ? "" : "verde"}">${totais.frete ? formatarPreco(totais.frete) : "Grátis"}</dd>`;
  document.querySelector("#total").textContent = formatarPreco(totais.total);

  const parcelas = Number(document.querySelector("#parcelas").value || 1);
  const info = {
    pix: "Pagamento à vista no Pix, com 5% de desconto.",
    credito: parcelas > 1 ? `${parcelas}x de ${formatarPreco(totais.total / parcelas)} sem juros no crédito.` : "À vista no crédito.",
    debito: "Pagamento à vista no débito.",
  };
  document.querySelector("#info-pagamento").textContent = info[forma];
}

// ---------- 4) Validação ----------
function mostrarErro(campo, mensagem) {
  const aviso = campo.parentElement.querySelector(".erro");
  campo.classList.toggle("invalido", Boolean(mensagem));
  if (aviso) aviso.textContent = mensagem;
  return !mensagem; // true = campo válido
}

function validarFormulario() {
  const valor = (id) => document.getElementById(id).value.trim();
  const numeros = (id) => valor(id).replace(/\D/g, "");
  const regras = [
    ["nome", valor("nome").split(" ").length < 2 ? "Digite nome e sobrenome." : ""],
    ["email", /^\S+@\S+\.\S+$/.test(valor("email")) ? "" : "Digite um e-mail válido."],
    ["telefone", numeros("telefone").length < 10 ? "Digite um celular com DDD." : ""],
    ["cpf", numeros("cpf").length !== 11 ? "O CPF precisa ter 11 números." : ""],
    ["cep", numeros("cep").length !== 8 ? "O CEP precisa ter 8 números." : ""],
    ["cidade", valor("cidade") ? "" : "Informe a cidade."],
    ["rua", valor("rua") ? "" : "Informe a rua."],
    ["numero", valor("numero") ? "" : "Informe o número."],
  ];

  // Os dados do cartão só são obrigatórios em crédito e débito
  if (formaEscolhida() !== "pix") {
    const [mes, ano] = valor("validade").split("/").map(Number);
    const hoje = new Date();
    const vencido = !mes || mes > 12 || 2000 + ano < hoje.getFullYear() ||
      (2000 + ano === hoje.getFullYear() && mes < hoje.getMonth() + 1);
    regras.push(
      ["numero-cartao", numeros("numero-cartao").length !== 16 ? "O cartão precisa ter 16 números." : ""],
      ["nome-cartao", valor("nome-cartao") ? "" : "Informe o nome do cartão."],
      ["validade", vencido ? "Validade inválida ou vencida." : ""],
      ["cvv", numeros("cvv").length < 3 ? "CVV com 3 ou 4 números." : ""],
    );
  }

  let tudoCerto = true;
  regras.forEach(([id, mensagem]) => {
    if (!mostrarErro(document.getElementById(id), mensagem)) tudoCerto = false;
  });
  return tudoCerto;
}

// Quando a pessoa corrige um campo, a mensagem de erro some
form.addEventListener("input", (evento) => {
  if (evento.target.classList.contains("invalido")) mostrarErro(evento.target, "");
});

// ---------- 5) Envio do pedido ----------
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!validarFormulario()) {
    document.querySelector(".invalido").focus();
    mostrarAviso("Confira os campos destacados em vermelho");
    return;
  }

  const forma = formaEscolhida();
  const pedido = {
    numero: "QC-" + Math.floor(100000 + Math.random() * 900000),
    data: new Date().toLocaleString("pt-BR"),
    cliente: { nome: form.nome.value, email: form.email.value },
    endereco: `${form.rua.value}, ${form.numero.value} ${form.complemento.value} · ${form.cidade.value} · CEP ${form.cep.value}`,
    pagamento: forma,
    parcelas: forma === "credito" ? Number(form.parcelas.value) : 1,
    finalCartao: forma !== "pix" ? form.numeroCartao.value.slice(-4) : null,
    itens: obterCarrinho(),
    totais: calcularTotais(forma),
  };

  // Guarda o pedido para a página de confirmação e esvazia o carrinho
  localStorage.setItem("quadraCerta_ultimoPedido", JSON.stringify(pedido));
  limparCarrinho();
  location.href = "confirmacao.html";
});

atualizarPagamento();
