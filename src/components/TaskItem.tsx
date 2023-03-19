import { Card, Checkbox, CloseButton, Flex, Text } from '@mantine/core'
import React from 'react'

function TaskItem({task, tasks, setTasks}) {

  function handleOnChange(id) {
    setTasks(tasks.map(t => {
        if (t.id === id) {
          t.isComplete = !task.isComplete
        }
        return t
      })
    )
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  function handleDelete(id) {
    setTasks(tasks.filter(t => t.id !== id));
    localStorage.setItem("tasks", JSON.stringify(tasks.filter(t => t.id !== id)))
  }

  return (
    <Card padding="md" radius="md" withBorder>
      <Flex align={'center'}>
        <Checkbox mr='sm' checked={task.isComplete} onChange={() => handleOnChange(task.id)} />
        <Text strikethrough={task.isComplete}>
          {task.title}
        </Text>
        <CloseButton ml="auto" onClick={() => handleDelete(task.id)} />
      </Flex>
    </Card>
  )
}

export default TaskItem