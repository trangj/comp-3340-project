import { Modal, Stack, TextInput, Button, Flex, Title, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'

function AddTaskModal({tasks, setTasks, taskLists}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');
  const [taskListId, setTaskListId] = useState('');

  function handleAddTask() {
    const newTask = {
      id: Date.now(),
      title,
      isComplete: false,
      taskListId
    }
    setTasks([...tasks, newTask]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
    close()
  }

  return (
    <>
      <Flex justify={'space-between'} align='center'>
        <Title order={3}>
          Task List
        </Title>
        <Button my="md" onClick={() => open()}>
          Add Task
        </Button>
      </Flex>
      <Modal opened={opened} onClose={close} title="Add Task" centered>
        <Stack>
          <TextInput
            placeholder="e.g Take the dog for a walk"
            label="Task Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Select
            label="Task List"
            data={taskLists.map(taskList => ({
                value: taskList.id,
                label: taskList.title
              })
            )}
            onChange={(v) => setTaskListId(v || '')}
          />
          <Button ml="auto" onClick={() => handleAddTask()}>
            Create Task
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default AddTaskModal