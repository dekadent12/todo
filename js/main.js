// Находим элементы на странице
const $form = document.querySelector('#form')
const $input = document.querySelector('#taskInput')
const $list = document.querySelector('#tasksList')
const $emptyList = document.querySelector('#emptyList')

let tasks = []

// Функция создания элемента задачи
const renderTask = task => {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'
	const taskHTML = `
		<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssClass}">${task.text}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18" />
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18" />
			</button>
		</div>
	</li>
		`

	$list.insertAdjacentHTML('beforeend', taskHTML)
}

// Если в LS есть данные, присвоить их в массив tasks
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	// Отобразить данные массива tasks на странице
	tasks.forEach(task => renderTask(task))
}

// Функция сохранения данных в LocalStorage
const saveToLocalStorage = () => {
	// Превращаем массив в строку
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Функция отображения "Список задач пуст"
const checkEmptyList = () => {
	if (tasks.length === 0) {
		const emptyListHTML = `
					<li id="emptyList" class="list-group-item empty-list">
						<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
						<div class="empty-list__title">Список дел пуст</div>
					</li>
	`

		$list.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	if (tasks.length > 0) {
		const emptyListElement = document.querySelector('#emptyList')

		emptyListElement ? emptyListElement.remove() : null
	}
}

checkEmptyList()

// Функция добавления задачи
const addTask = e => {
	e.preventDefault()

	// Достаём текст с input
	const taskText = $input.value

	// Работа с LocalStorage
	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Добавляем задачу в массив с задачами
	tasks.push(newTask)

	saveToLocalStorage()
	renderTask(newTask)

	// Очищаем поле ввода и возвращаем фокус на него
	$input.value = ''
	$input.focus()

	checkEmptyList()
}

// Функция удаления задачи
const deleteTask = e => {
	// Проверяем, что если кнопка удаления задачи НЕ нажата
	if (e.target.dataset.action !== 'delete') return

	// Проверяем, что нажата кнопка удаления задачи
	const perentEl = e.target.closest('.list-group-item')

	// Определяем id задачи
	const taskId = Number(perentEl.id)

	// Находим индекс задачи в массиве
	// const index = tasks.findIndex(task => task.id === taskId)

	// Удаляем задачу из массива
	// tasks.splice(index, 1)

	// Удаляем задачу через фильтрацию массива
	tasks = tasks.filter(task => task.id !== taskId)

	perentEl.remove()

	saveToLocalStorage()
	checkEmptyList()
}

// Функция отображения завершённой задачи
const doneTask = e => {
	if (e.target.dataset.action !== 'done') return

	const perentEl = e.target.closest('.list-group-item')
	const taskId = Number(perentEl.id)
	const task = tasks.find(task => task.id === taskId)

	task.done = !task.done

	saveToLocalStorage()

	const $taskTitle = perentEl.querySelector('.task-title')

	$taskTitle.classList.toggle('task-title--done')
}

$form.addEventListener('submit', addTask)
$list.addEventListener('click', deleteTask)
$list.addEventListener('click', doneTask)
