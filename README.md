🌿 Seiva Mística

Site de e-commerce de produtos esotéricos naturais — cristais, tarô e ervas — desenvolvido como projeto acadêmico de PW1.

Aplicação 100% front-end, sem back-end, com persistência de dados via `localStorage` do navegador.



📋 Sobre o projeto

A Seiva Mística é uma loja virtual fictícia que reúne cristais, baralhos de tarô e ervas aromáticas. O site permite navegar pelo catálogo, montar um carrinho, criar conta, finalizar pedidos e — para administradores — gerenciar produtos e consultar relatórios.

O objetivo do trabalho foi aplicar, na prática, os conceitos de HTML, CSS e JavaScript puro: manipulação de DOM, eventos, roteamento por hash, persistência local e controle de acesso por perfil de usuário.


✨ Funcionalidades

Área do cliente
- Navegação por categorias (Cristais, Tarô e Oráculos, Ervas Aromáticas e Banhos)
- Catálogo com imagem, nome, preço e botão de adicionar ao carrinho
- Carrinho com controle de quantidade, remoção de itens e cálculo de total
- Cadastro de usuário com nome, CPF, e-mail, senha e preferências
- Login por CPF e senha
- Finalização de pedido (exige usuário logado)
- Página "Meus Pedidos" com histórico pessoal

Área administrativa
- Acesso restrito ao perfil `admin`
- Cadastro de novos produtos
- Exclusão de produtos existentes
- Relatório completo com:
  - Total de produtos e valor em catálogo
  - Total de pedidos e usuários
  - Espaço usado no armazenamento
  - Produtos por categoria
  - Lista de produtos cadastrados
  - Lista de pedidos finalizados
  - Usuários cadastrados
  - Log das últimas 50 operações
- Botão para resetar todos os dados

🗂️ Estrutura de arquivos

