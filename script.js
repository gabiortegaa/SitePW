const ROTAS = {
  home:      'view-home',
  sobre:     'view-sobre',
  carrinho:  'view-carrinho',
  admin:     'view-admin',
  editar:    'view-editar',
  relatorio: 'view-relatorio',
  login:     'view-login',
  cadastro:  'view-cadastro',
  pedidos:   'view-pedidos',
  cristais:  'view-catalogo',
  taro:      'view-catalogo',
  ervas:     'view-catalogo'
};

const ROTAS_ADMIN = ['admin', 'editar', 'relatorio'];
const ROTAS_LOGADO = ['pedidos'];

function criarCardProduto(produto, modo) {
  modo = modo || 'catalogo';

  const article = document.createElement('article');
  article.className = 'produto';
  article.dataset.id = produto.id;

  const divImg = document.createElement('div');
  divImg.className = 'produto-img';
  const img = document.createElement('img');
  img.src = produto.imagem;
  img.alt = produto.nome;
  divImg.appendChild(img);

  const h4 = document.createElement('h4');
  h4.textContent = produto.nome;

  const footer = document.createElement('div');
  footer.className = 'produto-footer';

  const preco = document.createElement('span');
  preco.className = 'preco';
  preco.textContent = formatarPreco(produto.preco);
  footer.appendChild(preco);

  if (modo === 'catalogo') {
    const btn = document.createElement('button');
    btn.className = 'btn-bag';
    btn.setAttribute('aria-label', 'Adicionar ' + produto.nome);
    btn.dataset.add = produto.id;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1.2 12.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>';
    footer.appendChild(btn);
  }

  article.appendChild(divImg);
  article.appendChild(h4);
  article.appendChild(footer);

  if (modo === 'admin') {
    const acoes = document.createElement('div');
    acoes.className = 'produto-admin-acoes';

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn-excluir';
    btnExcluir.dataset.excluir = produto.id;
    btnExcluir.textContent = 'Excluir';

    acoes.appendChild(btnExcluir);
    article.appendChild(acoes);
  }

  return article;
}

function renderCategorias() {
  const grid = document.getElementById('gridCategorias');
  if (!grid) return;
  grid.innerHTML = '';
  CATEGORIAS.forEach(function (cat) {
    const a = document.createElement('a');
    a.href = '#' + cat.slug;
    a.className = 'categoria';
    a.innerHTML =
      '<div class="categoria-img"><img src="' + cat.imagem + '" alt="' + cat.nome + '"></div>' +
      '<h3>' + cat.nome + '</h3>' +
      '<span class="ver">Ver produtos</span>';
    grid.appendChild(a);
  });
}

function renderCatalogo(slug) {
  const grid = document.getElementById('gridProdutos');
  const titulo = document.getElementById('catalogoTitulo');
  if (!grid) return;

  const cat = CATEGORIAS.find(function (c) { return c.slug === slug; });
  if (titulo) titulo.textContent = cat ? cat.nome : 'Produtos';

  grid.innerHTML = '';
  produtosPorCategoria(slug).forEach(function (p) {
    grid.appendChild(criarCardProduto(p, 'catalogo'));
  });
}

function renderCarrinho() {
  const tbody = document.getElementById('carrinhoItens');
  const totalEl = document.getElementById('carrinhoTotal');
  if (!tbody) return;

  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="carrinho-vazio">Seu carrinho está vazio.</td></tr>';
    if (totalEl) totalEl.textContent = formatarPreco(0);
    return;
  }

  tbody.innerHTML = '';
  carrinho.forEach(function (item) {
    const p = buscarProduto(item.id);
    if (!p) return;

    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><div class="carrinho-produto"><img src="' + p.imagem + '" alt="' + p.nome + '"><span>' + p.nome + '</span></div></td>' +
      '<td><div class="qtd"><button data-menos="' + p.id + '" aria-label="Diminuir">−</button><span>' + item.qtd + '</span><button data-mais="' + p.id + '" aria-label="Aumentar">+</button></div></td>' +
      '<td>' + formatarPreco(p.preco) + '</td>' +
      '<td>' + formatarPreco(p.preco * item.qtd) + '</td>' +
      '<td><button class="btn-excluir" data-remover-carrinho="' + p.id + '">Remover</button></td>';
    tbody.appendChild(tr);
  });

  if (totalEl) totalEl.textContent = formatarPreco(totalCarrinho());
}

function renderEditar() {
  const grid = document.getElementById('gridEditar');
  if (!grid) return;
  grid.innerHTML = '';
  listarProdutos().forEach(function (p) {
    grid.appendChild(criarCardProduto(p, 'admin'));
  });
}

function renderRelatorio() {
  const rel = gerarRelatorio();

  const stats = document.getElementById('statsRelatorio');
  if (stats) {
    stats.innerHTML =
      '<div class="stat-card"><span class="stat-num">' + rel.produtos.total + '</span><span class="stat-label">Produtos</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + formatarPreco(rel.produtos.valorTotal) + '</span><span class="stat-label">Valor em catálogo</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + rel.pedidos.total + '</span><span class="stat-label">Pedidos</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + rel.usuarios.total + '</span><span class="stat-label">Usuários</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + rel.espacoUsado + '</span><span class="stat-label">Espaço usado</span></div>';
  }

  const tCat = document.getElementById('relCategorias');
  if (tCat) {
    tCat.innerHTML = rel.produtos.porCategoria.map(function (c) {
      return '<tr><td>' + c.nome + '</td><td>' + c.quantidade + '</td><td>' + formatarPreco(c.valor) + '</td></tr>';
    }).join('');
  }

  const tProd = document.getElementById('relProdutos');
  if (tProd) {
    tProd.innerHTML = listarProdutos().map(function (p) {
      return '<tr><td><code>' + p.id + '</code></td><td>' + p.nome + '</td><td>' + p.categoria + '</td><td>' + formatarPreco(p.preco) + '</td><td>' + p.estoque + '</td></tr>';
    }).join('');
  }

  const tPedidos = document.getElementById('relPedidos');
  if (tPedidos) {
    const pedidos = listarPedidos();
    tPedidos.innerHTML = pedidos.length
      ? pedidos.map(function (p) {
          const itensTxt = p.itens.map(function (i) { return i.qtd + 'x ' + i.nome; }).join(', ');
          return '<tr><td><code>' + p.codigo + '</code></td>' +
                 '<td>' + p.cliente + '</td>' +
                 '<td>' + itensTxt + '</td>' +
                 '<td>' + formatarPreco(p.total) + '</td>' +
                 '<td>' + new Date(p.data).toLocaleString('pt-BR') + '</td>' +
                 '<td><span class="tag">' + p.status + '</span></td></tr>';
        }).join('')
      : '<tr><td colspan="6" class="carrinho-vazio">Nenhum pedido finalizado.</td></tr>';
  }

  const tUser = document.getElementById('relUsuarios');
  if (tUser) {
    tUser.innerHTML = rel.usuarios.lista.length
      ? rel.usuarios.lista.map(function (u) {
          return '<tr><td>' + u.nome + '</td><td>' + u.cpf + '</td><td>' + u.email + '</td><td>' + ((u.preferencias || []).join(', ') || '—') + '</td></tr>';
        }).join('')
      : '<tr><td colspan="4" class="carrinho-vazio">Nenhum usuário cadastrado.</td></tr>';
  }

  const tLog = document.getElementById('relLog');
  if (tLog) {
    tLog.innerHTML = rel.log.length
      ? rel.log.map(function (l) {
          return '<tr><td><span class="tag">' + l.tipo + '</span></td><td>' + l.mensagem + '</td><td>' + new Date(l.quando).toLocaleString('pt-BR') + '</td></tr>';
        }).join('')
      : '<tr><td colspan="3" class="carrinho-vazio">Nenhuma operação registrada.</td></tr>';
  }
}

function renderPedidos() {
  const tbody = document.getElementById('listaPedidos');
  if (!tbody) return;

  const sessao = lerSessao();
  if (!sessao) return;

  const pedidos = pedidosDoUsuario(sessao.cpf);

  if (pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="carrinho-vazio">Você ainda não fez nenhum pedido.</td></tr>';
    return;
  }

  tbody.innerHTML = pedidos.map(function (p) {
    const itensTxt = p.itens.map(function (i) { return i.qtd + 'x ' + i.nome; }).join(', ');
    return '<tr><td><code>' + p.codigo + '</code></td>' +
           '<td>' + itensTxt + '</td>' +
           '<td>' + formatarPreco(p.total) + '</td>' +
           '<td>' + new Date(p.data).toLocaleString('pt-BR') + '</td>' +
           '<td><span class="tag">' + p.status + '</span></td></tr>';
  }).join('');
}

function render() {
  const hash = (location.hash || '#home').replace('#', '');
  const viewId = ROTAS[hash] || 'view-home';

  if (ROTAS_ADMIN.indexOf(hash) !== -1 && !ehAdmin()) {
    alert('Acesso restrito. Faça login como administrador.');
    location.hash = '#login';
    return;
  }

  if (ROTAS_LOGADO.indexOf(hash) !== -1 && !lerSessao()) {
    alert('Faça login para acessar seus pedidos.');
    location.hash = '#login';
    return;
  }

  document.querySelectorAll('.view').forEach(function (v) {
    v.classList.toggle('active', v.id === viewId);
  });

  document.querySelectorAll('[data-nav]').forEach(function (a) {
    a.classList.toggle('active', a.dataset.nav === hash);
  });

  if (viewId === 'view-catalogo')  renderCatalogo(hash);
  if (viewId === 'view-carrinho')  renderCarrinho();
  if (viewId === 'view-editar')    renderEditar();
  if (viewId === 'view-relatorio') renderRelatorio();
  if (viewId === 'view-pedidos')   renderPedidos();

  atualizarBadge();
  atualizarHeader();

  const nav = document.getElementById('nav');
  if (nav) nav.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function atualizarHeader() {
  const admin = ehAdmin();
  const sessao = lerSessao();

  document.querySelectorAll('.so-admin').forEach(function (el) {
    el.hidden = !admin;
  });

  document.querySelectorAll('.so-logado').forEach(function (el) {
    el.hidden = !sessao;
  });

  const btnLogin = document.getElementById('btnLoginHeader');
  const btnSair = document.getElementById('btnSairHeader');

  if (btnLogin) btnLogin.hidden = !!sessao;
  if (btnSair) {
    btnSair.hidden = !sessao;
    btnSair.textContent = sessao ? 'Sair (' + sessao.nome.split(' ')[0] + ')' : 'Sair';
  }
}

function atualizarBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = lerCarrinho().reduce(function (s, i) { return s + i.qtd; }, 0);
}

function mascaraCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

document.addEventListener('click', function (e) {
  const add = e.target.closest('[data-add]');
  if (add) { adicionarAoCarrinho(add.dataset.add); atualizarBadge(); return; }

  const mais = e.target.closest('[data-mais]');
  if (mais) { alterarQtdCarrinho(mais.dataset.mais, 1); renderCarrinho(); atualizarBadge(); return; }

  const menos = e.target.closest('[data-menos]');
  if (menos) { alterarQtdCarrinho(menos.dataset.menos, -1); renderCarrinho(); atualizarBadge(); return; }

  const remover = e.target.closest('[data-remover-carrinho]');
  if (remover) { removerDoCarrinho(remover.dataset.removerCarrinho); renderCarrinho(); atualizarBadge(); return; }

  const excluir = e.target.closest('[data-excluir]');
  if (excluir) {
    if (confirm('Excluir este produto da base?')) {
      removerProduto(excluir.dataset.excluir);
      renderEditar();
    }
    return;
  }
});

const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    document.getElementById('nav').classList.toggle('open');
  });
}

const formProduto = document.getElementById('formProduto');
if (formProduto) {
  formProduto.addEventListener('submit', function (e) {
    e.preventDefault();
    const f = new FormData(e.target);
    adicionarProduto({
      nome: f.get('nome'),
      categoria: f.get('categoria'),
      preco: f.get('preco'),
      estoque: f.get('estoque'),
      descricao: f.get('descricao'),
      imagem: f.get('imagem') || 'img/sem-imagem.jpg'
    });
    e.target.reset();
    alert('Produto adicionado à base!');
  });
}

const btnLimpar = document.getElementById('btnLimparCarrinho');
if (btnLimpar) {
  btnLimpar.addEventListener('click', function () {
    if (confirm('Esvaziar o carrinho?')) {
      limparCarrinho();
      renderCarrinho();
      atualizarBadge();
    }
  });
}

const btnFinalizar = document.getElementById('btnFinalizar');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', function () {
    if (!lerSessao()) {
      alert('Faça login ou cadastre-se para finalizar o pedido.');
      location.hash = '#login';
      return;
    }

    if (lerCarrinho().length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    if (!confirm('Confirmar a finalização do pedido no valor de ' + formatarPreco(totalCarrinho()) + '?')) {
      return;
    }

    const res = criarPedido();

    if (!res.ok) {
      alert(res.erro);
      return;
    }

    alert('Pedido ' + res.pedido.codigo + ' finalizado com sucesso!\nTotal: ' + formatarPreco(res.pedido.total));
    renderCarrinho();
    atualizarBadge();
    location.hash = '#pedidos';
  });
}

const btnAtualizarRel = document.getElementById('btnAtualizarRel');
if (btnAtualizarRel) btnAtualizarRel.addEventListener('click', renderRelatorio);

const btnResetar = document.getElementById('btnResetar');
if (btnResetar) {
  btnResetar.addEventListener('click', function () {
    if (confirm('Isso apaga TODOS os dados salvos. Continuar?')) {
      resetarBanco();
      renderRelatorio();
      atualizarBadge();
    }
  });
}

const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const user = autenticar(f.get('cpf'), f.get('senha'));

    if (!user) {
      alert('CPF ou senha incorretos.');
      return;
    }

    salvarSessao(user);
    registrarLog('LOGIN', 'Login de "' + user.nome + '" (' + (user.perfil || 'cliente') + ')');

    if (user.perfil === 'admin') {
      alert('Bem-vindo(a), ' + user.nome + '! Acesso administrativo liberado.');
      location.hash = '#admin';
    } else {
      alert('Bem-vindo(a), ' + user.nome + '!');
      location.hash = '#home';
    }
  });
}

const btnSair = document.getElementById('btnSairHeader');
if (btnSair) {
  btnSair.addEventListener('click', function () {
    encerrarSessao();
    atualizarHeader();
    alert('Sessão encerrada.');
    location.hash = '#home';
  });
}

const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', function (e) {
    e.preventDefault();
    const f = new FormData(e.target);

    const dados = {
      nome: f.get('nome'),
      cpf: f.get('cpf'),
      email: f.get('email'),
      senha: f.get('senha'),
      preferencias: f.getAll('pref')
    };

    const res = cadastrarUsuario(dados);

    if (!res.ok) {
      alert(res.erro);
      return;
    }

    const user = autenticar(dados.cpf, dados.senha);

    if (user) {
      salvarSessao(user);
      registrarLog('CADASTRO', 'Usuário "' + user.nome + '" cadastrado e logado');
      alert('Cadastro realizado! Bem-vindo(a), ' + user.nome + '.');
      atualizarHeader();
      location.hash = '#home';
    } else {
      alert('Cadastro realizado! Faça login para continuar.');
      location.hash = '#login';
    }
  });
}

document.querySelectorAll('input[name="cpf"]').forEach(function (inp) {
  inp.addEventListener('input', function () { mascaraCPF(inp); });
});

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', function () {
  iniciarBanco();
  renderCategorias();
  render();
  atualizarHeader();
});