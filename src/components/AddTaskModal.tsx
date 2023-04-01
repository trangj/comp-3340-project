import { Modal, Stack, TextInput, Button, Flex, Title, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import { supabase } from '../supabase';

function AddTaskModal({tasks, setTasks, taskLists}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');
  const [taskListId, setTaskListId] = useState('');

  async function handleAddTask() {
    const newTask = {
      title,
      task_list_id: taskListId
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        newTask,
      ])
      .select('*')
      .single();
    setTasks([...tasks, data]);
    close()
  }

  return (
    <>
      <Button my="md" onClick={() => open()}>
        Add Task
      </Button>
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