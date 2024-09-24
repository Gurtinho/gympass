## App

Gympass style app

### RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar.
- [x] Deve ser possível se autenticar.
- [x] Deve ser possível obter o perfil de um usuário logado.
- [x] Deve ser possível pegar o número de check-ins realizados pelo usuário logado.
- [x] Deve ser possível o usuário pegar o histórico de check-ins.
- [x] Deve ser possível o usuário buscar academias próximas (até 10km).
- [x] Deve ser possível o usuário buscar academias pelo nome.
- [x] Deve ser possível o usuário fazer checkin em uma academia.
- [x] Deve ser possível validar o check-in de um usuário.
- [x] Deve ser possível cadastrar uma academia.

### RNs (Regras de Negócio)

- [x] O usuário não deve poder se cadastrar com email duplicado.
- [x] O usuário não deve poder fazer 2 check-ins no mesmo dia.
- [x] O usuário não pode fazer check-ins se não estiver perto [100m] da academia.
- [x] O check-in só pode ser validado até 20 minutos após criado.
- [x] O check-in só pode ser validado por administradores. [Autorização]
- [x] A academia só pode ser cadastrada por administradores.

### RNFs (Requisitos Não Funcionais)

- [x] A senha do usuário precisa estar criptografada.
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSql.
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página.
- [x] O usuário deve ser identificado com um JWT (JSON Web Token).