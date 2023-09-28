const taskListContainer = document.querySelector(".app__section-task-list");

const formTask = document.querySelector(".app__form-add-task");
const toggleFormTaskBtn = document.querySelector(".app__button--add-task");
const formLabel = document.querySelector(".app__form-label");

const textArea = document.querySelector(".app__form-textarea");

const taskActiveDescription = document.querySelector(
  ".app__section-active-task-description"
);
const taskCancelBtn = document.querySelector(
  ".app__form-footer__button--cancel"
);
const taskDeleteBtn = document.querySelector(
  ".app__form-footer__button--delete"
);

const listClearFinishedBtn = document.getElementById("btn-remover-concluidas");
const listClearAllBtn = document.getElementById("btn-remover-todas");

// Variável criada para atribuir a key 'tarefas' dentro do localStorage
const localStorageTarefas = localStorage.getItem("tarefas");
// Variável que possuí uma condicional que se a key 'tarefas' no localStorage estiver vazia cria um array vazio, caso contrário accessa o localStorage e armazena os valores
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];

const taskIconSvg = `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" 
    fill="#FFF" />
<path
    d "M9 16.1719119.5938 5.57812121 6.9843819 18.9844L3.42188 13.4062L4.82812 12L19 16.17192"
    fill="#01080E" 
/svg>
`;

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragraphEmEdicao = null;

const selecionaTarefa = (tarefa, elemento) => {
  if (tarefa.concluida) {
    tarefaSelecionada = null
    return;
  }

  // Inicialmente seleciona todos elementos que possuem a class de ...item-active e os remove. Um reset
  document
    .querySelectorAll(".app__section-task-list-item-active")
    .forEach(function (button) {
      button.classList.remove("app__section-task-list-item-active");
    });

  // Condicional para desselecionar a tarefa atual. Ex: ao clicar em uma tarefa ativa limpa todos os valores previamente escolhidos

  if (tarefaSelecionada == tarefa) {
    taskActiveDescription.textContent = null;
    itemTarefaSelecionada = null;
    tarefaSelecionada = null;
    return;
  }

  // Esses dois blocos de código acima só funcionam caso já tenha alguma tarefa selecionada, então, quando não tem nenhuma tarefa selecionada o que vai funcionar é apenas esse bloco abaixo:

  // Seleção e atribuição de valores da tarefa atual
  tarefaSelecionada = tarefa;
  itemTarefaSelecionada = elemento;
  taskActiveDescription.textContent = tarefa.descricao;
  elemento.classList.add("app__section-task-list-item-active");
};

const limparForm = () => {
  tarefaEmEdicao = null;
  paragraphEmEdicao = null;
  textArea.value = "";
  formTask.classList.add("hidden");
};

const selecionaTarefaEdicao = (tarefa, elemento) => {
  if (tarefaEmEdicao == tarefa) {
    limparForm();
    return;
  }

  formLabel.textContent = "Editando Tarefa";
  tarefaEmEdicao = tarefa;
  paragraphEmEdicao = elemento;
  textArea.value = tarefa.descricao;
  formTask.classList.remove("hidden");
};

function createTask(tarefa) {
  // Cria uma variável que representa um elemento criado com tag 'li' e adiciona uma classe a esse elemento HTML
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  // Cria uma variável que representa um elemento a ser criado no documento, com a tag 'svg' e adiciona o link do svg diretamente no HTML
  const svgIcon = document.createElement("svg");
  svgIcon.innerHTML = taskIconSvg;

  // Cria um elemento de tag 'p', adiciona uma classe a ele. Finalmente, atribui o valor da decrição de cada objeto dentro de tarefas(linha 3)
  const paragraph = document.createElement("p");
  paragraph.classList.add("app__section-task-list-item-description");

  paragraph.textContent = tarefa.descricao;

  const button = document.createElement("button");

  button.classList.add("app_button-edit");
  const editIcon = document.createElement("img");
  editIcon.setAttribute("src", "/imagens/edit.png");
  button.appendChild(editIcon);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    selecionaTarefaEdicao(tarefa, paragraph);
  });

  li.onclick = () => {
    selecionaTarefa(tarefa, li);
  };

  svgIcon.addEventListener("click", (event) => {
    if (tarefa == tarefaSelecionada) {
      event.stopPropagation();
      button.setAttribute("disabled", true);
      li.classList.add("app__section-task-list-item-complete");
      tarefaSelecionada.concluida = true;
      updateLocalStorage();

      // Lógica para automáticamente desselecionar a tarefa quando concluída
      li.classList.remove("app__section-task-list-item-active")
      tarefaSelecionada = null
      taskActiveDescription.textContent = null
    }
});

  if (tarefa.concluida) {
    button.setAttribute("disabled", true);
    li.classList.add("app__section-task-list-item-complete");
  }

  // Com todos elementos criados e atribuidos a uma variável, cria uma hierarquia no HTML a ser injetado. O "li" é o pai dos elementos "svgIcon" e "paragraph"
  // A ideia visual do que está acontecendo é o seguinte em HTML:
  //
  // <ul class="app__section-task-list"></ul>         <----------- Onde eventualmente todos esses elementos vão ser inseridos
  //    <li class="app__section-task-list-item">
  //        <svg></svg>                               <----------- Aqui entra o link da linha 14 do taskIconSvg
  //        <p>tarefa.descricao</p>                   <----------- Aqui entra o texto do objeto dentro de tarefas com o atributo 'descricao'
  //    </li>
  li.appendChild(svgIcon);
  li.appendChild(paragraph);
  li.appendChild(button);

  // Finalmente retorna a estrutura que essa função cria, exemplificada acima, que então deve ser utilizada com um appendChild para inserir no target
  return li;
}

// Dentro dessa array de objetos, para cada objeto, é criado uma estrutura de 'li'
tarefas.forEach((task) => {
  // Chama-se a função para criar uma task, atribuida em uma variável, para cada objeto dentro de tarefas
  const taskItem = createTask(task);

  // Finalmente, no local desejado acrescenta-se a estrutura criada acima, para cada tarefa
  taskListContainer.appendChild(taskItem);
});

toggleFormTaskBtn.addEventListener("click", () => {
  formLabel.textContent = "Adicionando tarefa";
  formTask.classList.remove("hidden");
  textArea.value = "";
});

const updateLocalStorage = () => {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

// Evento para salvar task
formTask.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (tarefaEmEdicao) {
    tarefaEmEdicao.decricao = textArea.value;
    paragraphEmEdicao.textContent = textArea.value;
  }
  const task = {
    descricao: textArea.value,
    concluida: false,
  };
  tarefas.push(task);
  const taskItem = createTask(task);
  taskListContainer.appendChild(taskItem);

  updateLocalStorage();
  // Reset do form após salvar a task na lista
  limparForm();
});

// A const tem que ser chamada sem o parenteses no final para funcionar, por que é uma arrow function ao invés de uma function function
taskCancelBtn.addEventListener("click", limparForm);

taskDeleteBtn.addEventListener('click', () => {
    if (tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada)
        if (index !== -1) {
            tarefas.splice(index, 1)
        }

        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }
    updateLocalStorage()
    limparForm()
})

document.addEventListener("TarefaFinalizada", function (e) {
  if (tarefaSelecionada) {
    tarefaSelecionada.concluida = true;
    itemTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    itemTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", true);
    updateLocalStorage();
  }
});

const removerTarefas = (somenteConcluidas) => {

    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

listClearFinishedBtn.addEventListener('click', () => removerTarefas(true))
listClearAllBtn.addEventListener('click', () => removerTarefas(false))
