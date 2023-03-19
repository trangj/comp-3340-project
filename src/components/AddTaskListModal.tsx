import { Modal, Stack, TextInput, Button, Flex, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'

function AddTaskListModal({taskLists, setTaskLists}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');

  function handleAddTask() {
    const newTaskList = {
      id: Date.now(),
      title,
    }
    setTaskLists([...taskLists, newTaskList]);
    localStorage.setItem("taskLists", JSON.stringify([...taskLists, newTaskList]))
    close()
  }

  return (
    <>
      <Button fullWidth onClick={() => open()}>
        Add Task List
      </Button>
      <Modal opened={opened} onClose={close} title="Add Task" centered>
        <Stack>
          <TextInput
            placeholder="e.g Home Tasks"
            label="Task List Name"
            onChange={e => setTitle(e.target.value)}
          />
          <Button ml="auto" onClick={() => handleAddTask()}>
            Create Task List
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default AddTaskListModal