
const container = document.querySelector('.container')
const formAddTodo = document.querySelector('.form-add-todo')
const ul = document.querySelector('.todos-container')
const inputSearch = document.querySelector('.form-search input')
const searchFeedback = document.createElement('p')
const themeButton = document.querySelector('.switch')
const hideTodoListButton = document.querySelector('.hide-todo-btn')

let span
let mark

const renderLis = () => {
  if (!localStorage.getItem('toDoList')) return
  if (localStorage.getItem('toDoList') === '[]') return

  const tasksStorageArray = JSON.parse(localStorage.getItem('toDoList'))
  ul.innerHTML = ''

  tasksStorageArray.forEach((item) => {
    const li = document.createElement('li')
    li.setAttribute("data-todo", item)
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')

    const span = document.createElement('span')
    span.textContent = item

    const div = document.createElement('div')
    div.classList.add('btns')

    const deleteBtn = document.createElement('i')
    deleteBtn.setAttribute('data-trash', item)
    deleteBtn.classList.add('far', 'fa-trash-alt', 'delete')

    const editBtn = document.createElement("i")
    editBtn.setAttribute('data-edit', item)
    editBtn.classList.add('fa-sharp', 'fa-solid', 'fa-pen', 'edit')

    div.append(editBtn, deleteBtn)
    li.append(span, div)
    ul.appendChild(li)
  })
}

const addTasksToList = event => {
  event.preventDefault()
  const inputValue = event.target.add.value.trim()

  if (!localStorage.getItem('toDoList')) {
    const arr = []
    localStorage.setItem('toDoList', JSON.stringify(arr))
  }

  const tasksStorageArray = JSON.parse(localStorage.getItem('toDoList'))
  tasksStorageArray.push(inputValue)
  localStorage.setItem('toDoList', JSON.stringify(tasksStorageArray))

  renderLis()
  event.target.reset()
}

const deleteOrEditTask = event => {
  const clickedElement = event.target
  const trashDataValue = clickedElement.dataset.trash
  const editDataValue = clickedElement.dataset.edit

  if (trashDataValue) {
    const currentLi = document.querySelector(`[data-todo="${trashDataValue}"]`)
    const tasksStorageArray = JSON.parse(localStorage.getItem('toDoList'))
    const index = tasksStorageArray.indexOf(trashDataValue)
    tasksStorageArray.splice(index, 1)
    localStorage.setItem('toDoList', JSON.stringify(tasksStorageArray))

    currentLi.remove()
    renderLis()
  }

  if (editDataValue) {
    const currentLi = document.querySelector(`[data-todo="${editDataValue}"]`)
    const modalEditData = document.querySelector('.container-update-item')
    const modal = modalEditData.cloneNode(true)
    const input = modal.querySelector('input')

    input.setAttribute('value', editDataValue)
    modal.classList.toggle('open')
    currentLi.append(modal)

    const cancelButton = document.querySelector('.cancel')
    const updateButton = document.querySelector('.update')

    cancelButton.addEventListener('click', () => {
      const currentModal = currentLi.querySelector('.open')
      currentModal.remove()
    })

    updateButton.addEventListener('click', () => {
      const currentTaskValue = currentLi.querySelector('span')
      const inputNewTaskValue = currentLi.querySelector('.container-update-item .new-title')

      const tasksStorageArray = JSON.parse(localStorage.getItem('toDoList'))
      const currentTaskIndex = tasksStorageArray.indexOf(currentTaskValue.textContent)
      tasksStorageArray[currentTaskIndex] = inputNewTaskValue.value
      localStorage.setItem('toDoList', JSON.stringify(tasksStorageArray))
      const currentModal = currentLi.querySelector('.open')

      renderLis()
      currentModal.remove()
    })
  }
}

const filterListItems = (lis, inputValue, returnMatchedLis = boolean) => {
  return lis
    .filter(li => {
      const matched = li.textContent.toLowerCase().includes(inputValue.toLowerCase())
      return returnMatchedLis ? matched : !matched
    })
}

const manipulationClasses = (list, inputValue, classToAdd, classToRemove) => {
  list.forEach(li => {
    li.classList.add(classToAdd)
    li.classList.remove(classToRemove)
    span = li.childNodes[0]
    span.innerHTML = li.textContent

    const inputNull = inputValue === ""
    mark = `<mark>${inputValue}</mark>`

    if (inputNull) {
      return
    }
    if (classToAdd === 'd-flex') {
      span.innerHTML = span.textContent.replaceAll(inputValue, mark)
    }

  })

}

const hideListItem = (lis, inputValue) => {
  const listToHide = filterListItems(lis, inputValue, false)
  manipulationClasses(listToHide, inputValue, 'hidden', 'd-flex')
  const noTaskFound = listToHide.length === ul.children.length

  if (noTaskFound) {
    searchFeedback.classList.add('search-feedback')
    searchFeedback.textContent = 'Tarefa não encontrada :('
    ul.append(searchFeedback)
    searchFeedback.classList.remove('hidden')
  }
}

const showListItem = (lis, inputValue) => {
  const listToShow = filterListItems(lis, inputValue, true)
  manipulationClasses(listToShow, inputValue, 'd-flex', 'hidden')
  const aTaskFoundOrMore = listToShow.length >= 1

  if (aTaskFoundOrMore) {
    searchFeedback.classList.remove('d-flex')
    searchFeedback.classList.add('hidden')
  }
}

const showSearchResults = event => {
  const lis = Array.from(ul.children)
  const inputValue = event.target.value.trim()
  // const inputNull = inputValue === ""
  // mark = `<mark>${inputValue}</mark>`

  hideListItem(lis, inputValue)
  showListItem(lis, inputValue)

}

const toggleTheme = () => {
  const html = document.documentElement
  html.classList.toggle("light")
  document.body.classList.toggle('bg-dark')
}

const toggleTodoList = () => {
  container.classList.toggle('closed-to-do-list')
  document.body.classList.toggle('closed-to-do-list')
}

const simulateLoading = () => {
  const stopLoading = () => {
    const loader = document.querySelector('.loading')
    loader.classList.remove('loading')
    hideTodoListButton.style.opacity = 1
    container.style.opacity = 1
  }

  setTimeout(stopLoading, 2000)
}

formAddTodo.addEventListener('submit', addTasksToList)
ul.addEventListener('click', deleteOrEditTask)
inputSearch.addEventListener('input', showSearchResults)
themeButton.addEventListener('click', toggleTheme)
hideTodoListButton.addEventListener('click', toggleTodoList)
window.addEventListener('load', simulateLoading)

renderLis()

