import { Modal, Stack, TextInput, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'

function AddTaskModal({tasks, setTasks}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');

  function handleAddTask() {
    const newTask = {
      id: Date.now(),
      title,
      isComplete: false
    }
    setTasks([...tasks, newTask]);
    close()
  }

  return (
    <>
      <Button my="md" fullWidth onClick={() => open()}>
        Add Task
      </Button>
      <Modal opened={opened} onClose={close} title="Add Task" centered>
        <Stack>
          <TextInput
            placeholder="e.g Take the dog for a walk"
            label="Task Name"
            onChange={e => setTitle(e.target.value)}
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