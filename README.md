# Firebase Autenticação

Este projeto implementa autenticação de usuários utilizando **Firebase Authentication**. Ele inclui funcionalidades como login com email e senha, cadastro de novos usuários, recuperação de senha e login via Google. O sistema também utiliza o **Firebase Firestore** para armazenar informações adicionais dos usuários, como nome e email.

## Funcionalidades

- **Login com Email e Senha**: Permite que usuários existentes façam login com email e senha.
- **Cadastro de Novos Usuários**: Permite que novos usuários se cadastrem usando email e senha, salvando informações adicionais no Firestore.
- **Recuperação de Senha**: Permite que usuários recuperem a senha enviando um email de redefinição para o email cadastrado.
- **Login com Google**: Permite que usuários façam login utilizando suas contas do Google.
  
(![Captura de tela 2024-12-12 233933](https://github.com/user-attachments/assets/6fee003d-4e2f-437d-8486-127d7e4473f6))
(![Captura de tela 2024-12-12 234456](https://github.com/user-attachments/assets/bddadbd7-221a-42c7-b1d0-19541d8b141a)
)

## Tecnologias Utilizadas

- **HTML/CSS/JavaScript**: Interface do usuário.
- **Firebase Authentication**: Para autenticação de usuários (email/senha e login com Google).
- **Firebase Firestore**: Para armazenamento de dados dos usuários.
- **SweetAlert2**: Para exibição de mensagens de feedback.

## Instalação

### 1. Clonar o Repositório

Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/seu-usuario/firebase-authentication.git
cd firebase-authentication
