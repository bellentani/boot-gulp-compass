#Workflow para frontend usando Gulp

Esta é uma versão do workflow de trabalho feito em https://github.com/bellentani/boot-gulp

Estou fazendo ela em paralelo ao projeto com o Bourbon para manter-se a possibilidade de trabalho com o Bootstrap, que tem como base a library do Compass.

## Requisitos

Esse workflow usa o `gulp-compass` e precisa do Ruby e Compass instalados na sua máquina para compilar os arquivos. Instale o Ruby e depois, via terminal, é só usar os comandos:

```
$ gem update --system
$ gem install compass
```

O Compass será instalado e você poderá usar esse workflow.

##Instalação

Ao clonar o projeto você irá precisar realizar os dois itens abaixo.

Baixe o projeto e dê:

``npm install``

Caso não tenha o Gulp instalado:

``npm install gulp -g``

##Tarefas cadastradas

As tarefas estão em fase inicial, mas já dá pra utilizá-las para desenvolvimento.

###Converte Sass com Bourbon

``gulp compass``

Os arquivos são salvos na pasta ´´dist/css´´.

###Gera HTMLs utilizando o Handlebars.js

``gulp hbs``

Ela gera os arquivos html que estão na pasta ``src/templates/pages``, mas pode usar os arquivos na pasta ``src/templates/partials`` para compor sua estrutura como *partiais* do *Handlebars.js*.

Os arquivos são salvos na pasta ``dist``.

###Vigia modificações nos arquivos

``gulp watch``

Essa é a tarefa principal, ela ficará rodando enquanto não for interrompida e processa todos os arquivos editados na pasta ``src``.

A tarefa vigia os arquivos da tarefa ``gulp-compass``, ``gulp-handlebars`` e ``gulp-fonts``. Toda vez que tem alteração em arquivos presentes nestas tasks (.hbs, .scss, .sass, etc) nas pastas específicas de cada uma ele as executa.

Depois de fazer qualquer modificação ela carrega um servidor e abre em seu navegador padrão o arquivo ``dist/main.html``. Isso acontece na porta 8080. Se quiser ver outros arquivos basta colocar a URL sempre partindo do diretório ``src``.

**Exemplos:**

```
localhost:8080/seuarquivo.html
localhost:8080/umdiretorio/seuarquivo.html
```

##Outras tasks
``gulp browserSync``

``gulp fonts``

``gulp images``

``gulp images:opt``

``gulp js``

``gulp useref``

``gulp clean:dist``

``gulp build``

``gulp build:min``

``gulp default``

##Estrutura de pastas

```
dist (arquivos gerados pela task 'gulp deploy' ou pela 'gulp watch')
  |_css
    |_ ...
  |_img
  |_js
    |_plugins
    |_vendors
    |_ ...
src
  |_scss
    |_ ...
  |_img
  |_js
    |_plugins
    |_vendors
    |_ ...
  |_templates
    |_data
    |_helpers
    |_pages
    |_partials
      |_molecules
```
