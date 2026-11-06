/* pagina-produtos.js — lista de produtos com busca, filtros e ordenação
   Os filtros ficam na URL (ex.: produtos.html?cat=tenis&posicao=armador),
   assim os links do menu e da página inicial já abrem a lista filtrada. */

const form = document.querySelector("#form-filtros");
const grade = document.querySelector("#grade-produtos");
const seletorOrdem = document.querySelector("#ordenar");
const parametros = new URLSearchParams(location.search);
const termoBusca = (parametros.get("q") || "").trim().toLowerCase();

// 1) Preenche o formulário de filtros com o que veio na URL
form.cat.value = parametros.get("cat") || "";
parametros.getAll("posicao").forEach((valor) => {
  form.querySelector(`[name=posicao][value=${valor}]`).checked = true;
});
form.ofertas.checked = parametros.get("ofertas") === "1";

// 2) Função principal: filtra, ordena e desenha os produtos
function mostrarProdutos() {
  const categoria = form.cat.value;
  const posicoes = [...form.querySelectorAll("[name=posicao]:checked")].map((c) => c.value);
  const faixaPreco = form.preco.value; // ex.: "400-700"
  const soOfertas = form.ofertas.checked;

  let lista = PRODUTOS.filter((produto) => {
    if (categoria && produto.categoria !== categoria) return false;
    if (posicoes.length && !(produto.posicao || []).some((p) => posicoes.includes(p))) return false;
    if (soOfertas && !produto.precoAntigo) return false;
    if (faixaPreco) {
      const [minimo, maximo] = faixaPreco.split("-").map(Number);
      if (produto.preco < minimo || produto.preco > maximo) return false;
    }
    if (termoBusca) {
      const texto = (produto.nome + " " + produto.marca + " " + produto.descricao).toLowerCase();
      if (!texto.includes(termoBusca)) return false;
    }
    return true;
  });

  // Ordenação
  const ordem = seletorOrdem.value;
  if (ordem === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (ordem === "maior") lista.sort((a, b) => b.preco - a.preco);
  if (ordem === "desconto") lista.sort((a, b) => porcentagemDesconto(b) - porcentagemDesconto(a));
  if (ordem === "relevancia") lista.sort((a, b) => b.numAvaliacoes - a.numAvaliacoes);

  // Título e contagem
  const nomeCategoria = CATEGORIAS.find((c) => c.id === categoria);
  const titulo = soOfertas ? "Ofertas" : nomeCategoria ? nomeCategoria.nome : "Todos os produtos";
  document.querySelector("#titulo-lista").textContent = titulo;
  document.querySelector("#migalha-atual").textContent = titulo;
  document.querySelector("#contagem").textContent = `${lista.length} ${lista.length === 1 ? "produto" : "produtos"}`;
  document.title = `${titulo} | Quadra Certa`;

  // A posição de jogo só faz sentido para tênis
  document.querySelector("#filtro-posicao").hidden = categoria !== "" && categoria !== "tenis";

  grade.innerHTML = lista.map(criarCardProduto).join("");
  ativarBotoesAdicionar(grade);
  document.querySelector("#sem-resultados").hidden = lista.length > 0;
}

// 3) Mostra o termo pesquisado
if (termoBusca) {
  const aviso = document.querySelector("#termo-busca");
  aviso.hidden = false;
  aviso.innerHTML = `Resultados para <b>"${parametros.get("q")}"</b> · <a href="produtos.html">limpar busca</a>`;
}

// 4) Sempre que um filtro muda, a lista é refeita
form.addEventListener("change", mostrarProdutos);
seletorOrdem.addEventListener("change", mostrarProdutos);
form.addEventListener("reset", () => setTimeout(mostrarProdutos)); // espera o formulário limpar

// 5) No celular, o botão "Filtros" abre e fecha o painel
document.querySelector(".botao-filtros").addEventListener("click", () => {
  document.querySelector(".filtros").classList.toggle("aberto");
});

mostrarProdutos();
