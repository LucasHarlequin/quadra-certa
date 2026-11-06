/* pagina-inicial.js — monta as categorias e as vitrines da página inicial */

// Categorias: um cartão para cada categoria com a quantidade de produtos
const listaCategorias = document.querySelector("#lista-categorias");
listaCategorias.innerHTML = CATEGORIAS.map((categoria) => {
  const quantidade = PRODUTOS.filter((p) => p.categoria === categoria.id).length;
  return `
    <a class="categoria" href="produtos.html?cat=${categoria.id}">
      <span class="categoria__icone">${categoria.icone}</span>
      <strong>${categoria.nome}</strong>
      <small>${quantidade} produtos</small>
    </a>`;
}).join("") + `
    <a class="categoria categoria--ofertas" href="produtos.html?ofertas=1">
      <span class="categoria__icone">🏷️</span><strong>Ofertas</strong>
      <small>${PRODUTOS.filter((p) => p.precoAntigo).length} produtos</small>
    </a>`;

// Ofertas do dia: os 4 produtos com maior desconto
const ofertas = PRODUTOS
  .filter((p) => p.precoAntigo)
  .sort((a, b) => porcentagemDesconto(b) - porcentagemDesconto(a))
  .slice(0, 4);
const gradeOfertas = document.querySelector("#grade-ofertas");
gradeOfertas.innerHTML = ofertas.map(criarCardProduto).join("");
ativarBotoesAdicionar(gradeOfertas);

// Mais avaliados: os 8 produtos com mais avaliações
const destaques = [...PRODUTOS].sort((a, b) => b.numAvaliacoes - a.numAvaliacoes).slice(0, 8);
const gradeDestaques = document.querySelector("#grade-destaques");
gradeDestaques.innerHTML = destaques.map(criarCardProduto).join("");
ativarBotoesAdicionar(gradeDestaques);
