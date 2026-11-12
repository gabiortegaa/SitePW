const CHAVES = {
  produtos: 'seiva_produtos',
  carrinho: 'seiva_carrinho',
  usuarios: 'seiva_usuarios',
  log:      'seiva_log',
  sessao:   'seiva_sessao',
  pedidos:  'seiva_pedidos'
};

const ADMIN_PADRAO = {
  nome: 'Administrador',
  cpf: '000.000.000-00',
  email: 'admin@seivamistica.com.br',
  senha: 'admin123',
  perfil: 'admin',
  preferencias: []
};

function ler(chave, padrao = []) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch (e) {
    console.error('Erro ao ler', chave, e);
    return padrao;
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function iniciarBanco() {
  if (!localStorage.getItem(CHAVES.produtos)) gravar(CHAVES.produtos, PRODUTOS_INICIAIS);
  if (!localStorage.getItem(CHAVES.carrinho)) gravar(CHAVES.carrinho, []);
  if (!localStorage.getItem(CHAVES.log))      gravar(CHAVES.log, []);
  if (!localStorage.getItem(CHAVES.pedidos))  gravar(CHAVES.pedidos, []);

  const usuarios = ler(CHAVES.usuarios);
  if (!usuarios.some(u => u.perfil === 'admin')) {
    usuarios.push(ADMIN_PADRAO);
    gravar(CHAVES.usuarios, usuarios);
  }
}

function listarProdutos() { return ler(CHAVES.produtos); }

function produtosPorCategoria(slug) {
  return listarProdutos().filter(p => p.categoria === slug);
}

function buscarProduto(id) {
  return listarProdutos().find(p => p.id === id);
}

function adicionarProduto(produto) {
  const lista = listarProdutos();
  const novo = {
    id: produto.id || 'prod-' + Date.now(),
    categoria: produto.categoria || 'cristais',
    nome: produto.nome,
    descricao: produto.descricao || '',
    preco: Number(produto.preco) || 0,
    imagem: produto.imagem || 'img/sem-imagem.jpg',
    estoque: Number(produto.estoque) || 0
  };
  lista.push(novo);
  gravar(CHAVES.produtos, lista);
  registrarLog('ADICIONAR', 'Produto "' + novo.nome + '" adicionado');
  return novo;
}

function removerProduto(id) {
  const lista = listarProdutos();
  const alvo = lista.find(p => p.id === id);
  gravar(CHAVES.produtos, lista.filter(p => p.id !== id));
  if (alvo) registrarLog('REMOVER', 'Produto "' + alvo.nome + '" removido');
}

function atualizarProduto(id, dados) {
  const lista = listarProdutos();
  const i = lista.findIndex(p => p.id === id);
  if (i === -1) return null;
  lista[i] = Object.assign({}, lista[i], dados);
  gravar(CHAVES.produtos, lista);
  registrarLog('ATUALIZAR', 'Produto "' + lista[i].nome + '" atualizado');
  return lista[i];
}

function lerCarrinho() { return ler(CHAVES.carrinho); }

function adicionarAoCarrinho(id) {
  const carrinho = lerCarrinho();
  const item = carrinho.find(i => i.id === id);
  if (item) item.qtd++;
  else carrinho.push({ id: id, qtd: 1 });
  gravar(CHAVES.carrinho, carrinho);
  registrarLog('CARRINHO', 'Item ' + id + ' adicionado ao carrinho');
  return carrinho;
}

function alterarQtdCarrinho(id, delta) {
  let carrinho = lerCarrinho();
  const item = carrinho.find(i => i.id === id);
  if (!item) return carrinho;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter(i => i.id !== id);
  gravar(CHAVES.carrinho, carrinho);
  return carrinho;
}

function removerDoCarrinho(id) {
  const carrinho = lerCarrinho().filter(i => i.id !== id);
  gravar(CHAVES.carrinho, carrinho);
  registrarLog('CARRINHO', 'Item ' + id + ' removido do carrinho');
  return carrinho;
}

function limparCarrinho() {
  gravar(CHAVES.carrinho, []);
  registrarLog('CARRINHO', 'Carrinho esvaziado');
}

function totalCarrinho() {
  return lerCarrinho().reduce(function (soma, item) {
    const p = buscarProduto(item.id);
    return p ? soma + p.preco * item.qtd : soma;
  }, 0);
}

function listarUsuarios() { return ler(CHAVES.usuarios); }

function cadastrarUsuario(dados) {
  const usuarios = listarUsuarios();
  if (usuarios.some(u => u.cpf === dados.cpf)) {
    return { ok: false, erro: 'CPF já cadastrado.' };
  }
  usuarios.push({
    nome: dados.nome,
    cpf: dados.cpf,
    email: dados.email,
    senha: dados.senha,
    perfil: 'cliente',
    preferencias: dados.preferencias || [],
    criadoEm: new Date().toISOString()
  });
  gravar(CHAVES.usuarios, usuarios);
  registrarLog('CADASTRO', 'Usuário "' + dados.nome + '" cadastrado');
  return { ok: true };
}

function autenticar(cpf, senha) {
  return listarUsuarios().find(u => u.cpf === cpf && u.senha === senha) || null;
}

function salvarSessao(usuario) {
  gravar(CHAVES.sessao, {
    nome: usuario.nome,
    cpf: usuario.cpf,
    perfil: usuario.perfil || 'cliente',
    entrouEm: new Date().toISOString()
  });
}

function lerSessao() {
  return ler(CHAVES.sessao, null);
}

function encerrarSessao() {
  localStorage.removeItem(CHAVES.sessao);
  registrarLog('SESSAO', 'Logout realizado');
}

function usuarioLogado() {
  return lerSessao();
}

function ehAdmin() {
  const s = lerSessao();
  return !!s && s.perfil === 'admin';
}

function listarPedidos() { return ler(CHAVES.pedidos); }

function criarPedido() {
  const sessao = lerSessao();
  if (!sessao) {
    return { ok: false, erro: 'É preciso estar logado para finalizar o pedido.' };
  }

  const carrinho = lerCarrinho();
  if (carrinho.length === 0) {
    return { ok: false, erro: 'Seu carrinho está vazio.' };
  }

  const itens = carrinho.map(function (item) {
    const p = buscarProduto(item.id);
    return {
      id: item.id,
      nome: p ? p.nome : item.id,
      preco: p ? p.preco : 0,
      qtd: item.qtd,
      subtotal: p ? p.preco * item.qtd : 0
    };
  });

  const pedidos = listarPedidos();
  const numero = pedidos.length + 1;

  const pedido = {
    numero: numero,
    codigo: 'PED-' + String(numero).padStart(4, '0'),
    cliente: sessao.nome,
    cpf: sessao.cpf,
    itens: itens,
    total: itens.reduce(function (s, i) { return s + i.subtotal; }, 0),
    data: new Date().toISOString(),
    status: 'Finalizado'
  };

  pedidos.unshift(pedido);
  gravar(CHAVES.pedidos, pedidos);

  limparCarrinho();
  registrarLog('PEDIDO', 'Pedido ' + pedido.codigo + ' finalizado por "' + sessao.nome + '"');

  return { ok: true, pedido: pedido };
}

function pedidosDoUsuario(cpf) {
  return listarPedidos().filter(function (p) { return p.cpf === cpf; });
}

function registrarLog(tipo, mensagem) {
  const log = ler(CHAVES.log);
  log.unshift({ tipo: tipo, mensagem: mensagem, quando: new Date().toISOString() });
  gravar(CHAVES.log, log.slice(0, 50));
}

function listarLog() { return ler(CHAVES.log); }

function gerarRelatorio() {
  const produtos = listarProdutos();
  const carrinho = lerCarrinho();
  const usuarios = listarUsuarios();
  const pedidos = listarPedidos();

  const porCategoria = CATEGORIAS.map(function (cat) {
    const itens = produtos.filter(p => p.categoria === cat.slug);
    return {
      nome: cat.nome,
      quantidade: itens.length,
      valor: itens.reduce((s, p) => s + p.preco, 0)
    };
  });

  const valorTotal = produtos.reduce((s, p) => s + p.preco, 0);

  return {
    produtos: {
      total: produtos.length,
      valorTotal: valorTotal,
      precoMedio: produtos.length ? valorTotal / produtos.length : 0,
      porCategoria: porCategoria
    },
    carrinho: {
      itens: carrinho.length,
      unidades: carrinho.reduce((s, i) => s + i.qtd, 0),
      total: totalCarrinho()
    },
    pedidos: {
      total: pedidos.length,
      valorTotal: pedidos.reduce((s, p) => s + p.total, 0),
      lista: pedidos
    },
    usuarios: { total: usuarios.length, lista: usuarios },
    log: listarLog(),
    espacoUsado: calcularEspaco()
  };
}

function calcularEspaco() {
  let bytes = 0;
  Object.keys(CHAVES).forEach(function (k) {
    const valor = localStorage.getItem(CHAVES[k]);
    if (valor) bytes += valor.length * 2;
  });
  return (bytes / 1024).toFixed(2) + ' KB';
}

function resetarBanco() {
  Object.keys(CHAVES).forEach(function (k) {
    localStorage.removeItem(CHAVES[k]);
  });
  iniciarBanco();
}