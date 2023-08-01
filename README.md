# Sobre a solução

Para para rodar o projeto é necessário ter instalado em sua maquina [node js v18.16.1](https://nodejs.org/en/download) e [docker](https://www.docker.com/products/docker-desktop/).

### Configurando o ambiente

Criar um arquivo .env a partir do .env.example e configurar de acordo com sua escolha.

Após fazer o clone do repositório é necessário instalar as dependências:

```bash
npm ci
```

Tendo as dependências nas versões corretas, precisamos rodar o docker compose, para isso inicie o docker no seu local e rode o seguinte comando:

```bash
docker compose up -d  # a flag -d roda o container em background
```

### Iniciando o Projeto

Para iniciar o servidor é necessário executar o comando:

```bash
npm run start:dev
```

### Rodando os testes

```bash
npm run test
```

Após iniciado, o servidor deve estar rodando na porta de configuração (arquivo .env) ex: http://localhost:3001/

## Estrutura do código

Os padrão de arquitetura utilizado como referencia foi arquitetura hexagonal, onde o desenvolvimento é focado em sentido ao domínio, dependendo de interfaces e não implementações, separando contextos e responsabilidades facilitando manutenção, adição de novas funcionalidades e a implementação de testes.

## O funcionamento da API

O endpoint implementado é /api/convert/:amount sendo o amount um inteiro representando o valor a ser convertido sempre em menor unidade (centavos);

Ex: /api/convert/52999 ⇒ R$ 529.99

Assim como parâmetro de entrada, o valor na saída também será em centavos pela facilidade de trabalhar com números inteiros e também para converter ou formatar.

Ex: 

```json
{
    "USD": 11065, // R$110.65
    "EUR": 10076, // R$100.76
    "INR": 883317 // R$8833.17
}
```