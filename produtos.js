const CATEGORIAS = [
  { slug: 'cristais', nome: 'Cristais',                 imagem: 'img/cat-cristais.jpg' },
  { slug: 'taro',     nome: 'Tarô e Oráculos',          imagem: 'img/cat-taro.jpg' },
  { slug: 'ervas',    nome: 'Ervas Aromáticas e Banhos', imagem: 'img/cat-ervas.jpg' }
];

const PRODUTOS_INICIAIS = [
  { id: 'ametista',         categoria: 'cristais', nome: 'Ametista', preco: 25.00,  imagem: 'img/ametista.jpg',         descricao: 'Pedra de proteção e equilíbrio energético.', estoque: 10 },
  { id: 'pirita',           categoria: 'cristais', nome: 'Pirita', preco: 41.00,  imagem: 'img/pirita.jpg',           descricao: 'Conhecida como o ouro dos tolos, atrai prosperidade.', estoque: 8 },
  { id: 'quartzo-rosa',     categoria: 'cristais', nome: 'Quartzo Rosa', preco: 39.00,  imagem: 'img/quartzo-rosa.jpg',     descricao: 'Cristal do amor próprio e das relações afetivas.', estoque: 12 },
  { id: 'taro-waite',       categoria: 'taro',     nome: 'Tarô Waite Clássico — Deck com 78 cartas', preco: 189.00, imagem: 'img/taro-waite.jpg',       descricao: 'O baralho de tarô mais tradicional do mundo.', estoque: 5 },
  { id: 'baralho-cigano',   categoria: 'taro',     nome: 'Baralho cigano — caixa com livro + 36 cartas', preco: 129.00, imagem: 'img/baralho-cigano.jpg',   descricao: 'Kit completo com livro guia e 36 cartas.', estoque: 7 },
  { id: 'true-love-oracle', categoria: 'taro',     nome: 'True Love Oracle — Oráculo do Amor Verdadeiro', preco: 139.00, imagem: 'img/true-love-oracle.jpg', descricao: 'Oráculo voltado para questões do coração.', estoque: 4 },
  { id: 'kit-7-banhos',     categoria: 'ervas',    nome: 'Kit 7 Banhos de Ervas 20 g — Amor, Proteção, Descarrego +', preco: 96.00, imagem: 'img/kit-7-banhos.jpg',     descricao: 'Sete sachês de ervas para diferentes intenções.', estoque: 15 },
  { id: 'kit-ervas-secas',  categoria: 'ervas',    nome: 'Kit de Ervas Secas — 21 sacos de 210 g', preco: 183.00, imagem: 'img/kit-ervas-secas.jpg',  descricao: 'Seleção completa de ervas secas para rituais.', estoque: 6 },
  { id: 'kit-mistico',      categoria: 'ervas',    nome: 'Kit Místico Banho da Feiticeira com Incenso Natural e Ervas Selecionadas', preco: 93.00, imagem: 'img/kit-mistico.jpg',      descricao: 'Pote de vidro com ervas e dois feixes defumadores.', estoque: 9 }
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}