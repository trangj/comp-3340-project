import { Modal, Stack, TextInput, Button, Flex, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import { supabase } from '../supabase';

function AddTaskListModal({taskLists, setTaskLists}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');

  async function handleAddTask() {
    const newTaskList = {
      title,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }
    const { data, error } = await supabase
      .from('task_list')
      .insert([
        newTaskList,
      ])
      .select('*')
      .single();
    setTaskLists([...taskLists, data]);
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