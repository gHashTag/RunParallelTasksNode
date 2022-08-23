export const doTask = async ({ taskName, onEndTask, onStartTask }: generateTaskListT) => {
  const begin = Date.now()
  onStartTask()
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var end = Date.now()
      var timeSpent = end - begin + 'ms'
      console.log(
        '\x1b[36m',
        '[TASK] FINISHED: ' + taskName + ' in ' + timeSpent,
        '\x1b[0m'
      )
      onEndTask()
      resolve(true)
    }, Math.random() * 200)
  })
}
interface generateTaskListT {
  taskName: string
  onEndTask: () => void
  onStartTask: () => void
}
