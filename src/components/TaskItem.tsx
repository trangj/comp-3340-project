import { Card, Checkbox, CloseButton, Flex, Text } from '@mantine/core'
import React from 'react'
import { supabase } from '../supabase'

function TaskItem({task, tasks, setTasks}) {

  async function handleOnChange(id) {
    const { data, error } = await supabase.from('tasks').update({ is_complete: !task.is_complete }).eq('id', id).select('*').single()
    if (!error) {
      setTasks(tasks.map(t => {
          if (t.id === id) {
            t.is_complete = data.is_complete
          }
          return t
        })
      )
    }
  }

  async function handleDelete(id) {
    const {error} = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  }

  return (
    <Card padding="md" radius="md" withBorder>
      <Flex align={'center'}>
        <Checkbox mr='sm' checked={task.is_complete} onChange={() => handleOnChange(task.id)} />
        <Text strikethrough={task.is_complete}>
          {task.title}
        </Text>
        <CloseButton ml="auto" onClick={() => handleDelete(task.id)} />
      </Flex>
    </Card>
  )
}

export default TaskItem