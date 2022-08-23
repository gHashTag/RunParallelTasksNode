import { generateTaskList } from './helpers/generateTaskList'
import { doTask } from './helpers/doTask'

const concurrencyMax = 5
const taskDataLength = 50
const taskData = generateTaskList(taskDataLength)
let currentConcurrency = 0
let resolvedTaskCount = 0

// Выводим в  консоль данные
const onEndTask = () => {
  resolvedTaskCount++
  console.log('🚀 - currentConcurrency', currentConcurrency)
  console.log('🚀 - concurrencyMax', concurrencyMax)
  console.log('🚀 - resolvedTaskCount', resolvedTaskCount)
  console.log('🚀 - taskDataLength', taskDataLength)
  currentConcurrency--
}

const onStartTask = () => {
  currentConcurrency++
}

const someFunc = async () => {
  // Создаем ограниченный массив и заполняем их промисами
  const arrayOfPromises: any = []
  arrayOfPromises.length = concurrencyMax
  arrayOfPromises.fill(Promise.resolve())

  // Время начала теста
  const startTime = Date.now()

  const startNewTask = async (p: any) => {
    if (taskData.length) {
      // удаляем последний элемент и возвращаемего
      // не использовал shift потому, что легче убрать элемент с конца,
      // чем убрать с начала и двигать у каждого элемента индекс
      const arg = taskData.pop()
      if (arg)
        // ожидаем разрешение промиса и запускааемновую
        // в первые 5 раз разрешаются мгновенно
        // в остальных случаях идет ожидание разрешения функций из arg переменной
        return p.then(() => {
          // запускаем асинхронную функцию
          // используем замыкание и запускаем новое ожидание, при завершении одной из асинхронной функции
          return startNewTask(doTask({ taskName: arg, onEndTask, onStartTask }))
        })
    }
    return p
  }
  // Запускаем паралллельно промисы
  await Promise.all(arrayOfPromises.map(startNewTask))
  // Смотрим затраченное время
  const dateDiff = startTime - Date.now()
  console.log('🚀 - dateDiff', dateDiff)
}
someFunc()
