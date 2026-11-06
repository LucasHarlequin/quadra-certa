# 🏀 Quadra Certa — Loja virtual de basquete

Projeto da disciplina de **Criação de Sites**: um e-commerce simulado de artigos de basquete
(tênis, bolas e regatas), inspirado na organização de grandes marketplaces, mas com nome,
identidade visual e produtos próprios.

> ⚠️ Projeto acadêmico. Nenhum pagamento é real; use apenas dados fictícios.

##  Funcionalidades

**Obrigatórias**
- Página inicial com banner, categorias, ofertas e produtos mais avaliados
- Menu de navegação e área de categorias (Tênis, Bolas, Regatas e Ofertas)
- Produtos com imagem, nome, descrição e preço
- Página de detalhes do produto (escolha de tamanho e quantidade)
- Carrinho: adicionar, alterar quantidade, remover e cálculo do total
- Checkout com formulário de dados do cliente e endereço
- Pagamento por **Pix**, **cartão de crédito (com parcelamento até 10x)** e **cartão de débito**
- Página de confirmação do pedido

**Extras**
-  Busca de produtos
-  Filtros por categoria, posição de jogo, faixa de preço e ofertas + ordenação
-  Carrinho salvo no navegador (`localStorage`)
-  Cálculo de frete simulado pelo CEP (grátis acima de R$ 299)
-  Cupom de desconto (teste `QUADRA10` ou `BASQUETE5`)
-  5% de desconto no Pix e QR Code ilustrativo
-  Avaliações de produtos
-  Validação do formulário com máscaras (CPF, celular, CEP, cartão)
-  Layout responsivo (computador e celular)

## 🛠️ Tecnologias
- **HTML5** — estrutura das páginas
- **CSS3** — estilo, variáveis de cor, Grid/Flexbox e media queries
- **JavaScript** (puro, sem frameworks) — carrinho, filtros, cálculos e validações
- **Git e GitHub** — controle de versão

## 📁 Estrutura de pastas
```
quadra-certa/
├── index.html          # Página inicial
├── produtos.html       # Lista de produtos (busca, filtros e ordenação)
├── produto.html        # Detalhes do produto
├── carrinho.html       # Carrinho de compras
├── checkout.html       # Dados do cliente e pagamento
├── confirmacao.html    # Pedido realizado
├── css/
│   └── style.css       # Todo o estilo do site
├── js/
│   ├── dados.js            # Lista de produtos e categorias
│   ├── carrinho.js         # Lógica do carrinho e dos cálculos
│   ├── app.js              # Funções usadas em todas as páginas
│   ├── pagina-inicial.js
│   ├── pagina-produtos.js
│   ├── pagina-produto.js
│   ├── pagina-carrinho.js
│   ├── pagina-checkout.js
│   └── pagina-confirmacao.js
└── img/                # Logo, ícone, banner e fotos dos produtos (img/produtos)
```

## ▶️ Como executar
1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/quadra-certa.git
   ```
2. Abra o arquivo `index.html` no navegador (ou use a extensão **Live Server** do VS Code).

Não precisa instalar nada. As fotos ficam na pasta `img/produtos` e são do banco de imagens
gratuito [Unsplash](https://unsplash.com) (licença livre). O script `baixar-imagens.ps1` foi usado para baixá-las.

## 💳 Dados para testar o pagamento
| Campo | Exemplo fictício |
|---|---|
| Cartão | 4111 1111 1111 1111 |
| Validade | 12/30 |
| CVV | 123 |
| Cupom | QUADRA10 |

## 👤 Autor
Feito por **Lucas** — Curso Técnico em Informática.
