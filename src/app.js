const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;
  const repository = { id: uuid(), title, url, techs, likes };
  
  //Adiciona o novo repositório na lista de repositórios
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = {id, title, url, techs};

  //Verifica o índice do repositório com id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found."});
  }

  //Remove as propriedades que não foram informadas para alteração
  for(let propName in repository){
    if(repository[propName] === undefined)
      delete repository[propName];
  }

  //Mescla as propriedades do repositório atual com as alterações do update
  const currentRepository = repositories[repositoryIndex];
  const newRepository = {...currentRepository, ...repository};

  //Atualiza o repositório informado
  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //Verifica o índice do repositório com id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found."});
  }

  //Faz a remoção do repositório informado
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //Verifica o índice do repositório com id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found."});
  }

  //Adiciona um like ao repositório informado
  repositories[repositoryIndex].likes++;

  const repository = repositories[repositoryIndex];
  return response.json(repository);
});

module.exports = app;
