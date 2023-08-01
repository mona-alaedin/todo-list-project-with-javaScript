// ? TODO LIST

// Select
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
const modal = document.querySelector(".modal-container");
const backdrop = document.querySelector(".backdrop");
const editInput = document.querySelector(".edit-input");
const editModalBtn = document.querySelector(".edit__btn");
const cancelModalBtn = document.querySelector(".cancel__btn");

let filterValue = "all";

document.addEventListener("DOMContentLoaded", () => {
  const todos = getAllTodos();
  createTodos(todos);
});

// * Events
todoForm.addEventListener("submit", addNewTodo);
selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

editModalBtn.addEventListener("click", editTodoBtn);
backdrop.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
// * Functions

function addNewTodo(e) {
  e.preventDefault();
  if (!todoInput.value) return alert("please add a todo!!");
  //* create an object
  const newObj = {
    title: todoInput.value,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };
  saveTodo(newObj);
  filterTodos();
}

// create todos on DOM.
function createTodos(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `
    <li class="todo">
    <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
    <span class="todo-createdAt">${new Date(todo.createdAt).toLocaleDateString(
      "fa-IR"
    )}</span>
    <button class="todo__edit" data-todo-id=${todo.id}>ویرایش</button>
    <button class="todo__check" data-todo-id=${
      todo.id
    }><i class="far fa-check-square"></i></button>
    <button class="todo__remove" data-todo-id=${
      todo.id
    }><i class="far fa-trash-alt"></i></button></li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", removeTodos);
  });
  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => {
    btn.addEventListener("click", completeTodos);
  });

  const editTodobtns = [...document.querySelectorAll(".todo__edit")];
  editTodobtns.forEach((btn) => {
    btn.addEventListener("click", showModal);
  });
}

function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((todo) => {
        return todo.isCompleted;
      });
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((todo) => {
        return !todo.isCompleted;
      });
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function removeTodos(e) {
  let todos = getAllTodos();
  const dataId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== dataId);
  saveAllTodos(todos);
  filterTodos();
}

function completeTodos(e) {
  let todos = getAllTodos();
  const dataId = Number(e.target.dataset.todoId);
  const findTodo = todos.find((t) => t.id === dataId);
  findTodo.isCompleted = !findTodo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

let dataId;
function showModal(e) {
  modal.classList.remove("hidden");
  backdrop.classList.remove("hidden");
  dataId = Number(e.target.dataset.todoId);
  const todos = getAllTodos();
  const finded = todos.find((t) => t.id === dataId);
  editInput.value = finded.title;
}

function editTodoBtn() {
  if (!editInput.value) return alert("please add a todo!!");
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
  const todos = getAllTodos();
  const finded = todos.find((t) => t.id === dataId);
  finded.title = editInput.value;
  saveAllTodos(todos);
  createTodos(todos);
}

function closeModal() {
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
}

// local Storage
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todo) {
  localStorage.setItem("todos", JSON.stringify(todo));
}
