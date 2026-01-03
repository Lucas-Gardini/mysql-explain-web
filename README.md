## MySQL Explain Web

Visualize facilmente o resultado do EXPLAIN do MySQL em formato gráfico!

Este projeto é uma aplicação web feita com Nuxt 4 e Bun, que converte o resultado do comando `EXPLAIN` do MySQL (em formato JSON) em uma visualização gráfica clara e intuitiva.

### Funcionalidades

- Interface web moderna e responsiva
- Cole ou envie o JSON do EXPLAIN do MySQL
- Visualização gráfica do plano de execução
- Download da imagem gerada
- Totalmente executável via Docker

### Como usar

1. Gere o JSON do EXPLAIN no seu MySQL:
   ```sql
   EXPLAIN FORMAT=JSON SELECT ...
   ```
2. Copie o JSON e cole na interface web.
3. Clique em "Gerar" para visualizar o plano de execução.
4. Baixe a imagem se desejar.

### Rodando localmente com Docker

Build da imagem:

```sh
docker build -t mysql-explain-web .
```

Execute o container:

```sh
docker run -d -p 3000:3000 --name mysql-explain-web mysql-explain-web
```

Acesse em: http://localhost:3000
