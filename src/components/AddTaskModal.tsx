import { Modal, Stack, TextInput, Button, Flex, Title, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase';

function AddTaskModal({ tasks, setTasks, taskLists, fetchTasks, selectedTaskList}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');
  const [taskListId, setTaskListId] = useState('');

  useEffect(() => {
    setTaskListId(taskLists[0]?.id || '');
  }, [opened, taskLists]);

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
    //setTasks([...tasks, data]);

    selectedTaskList == null ? fetchTasks(-1) : fetchTasks(selectedTaskList.id);

    close();

  }

  async function deleteCompletedTasks() {
    const shouldDelete = window.confirm('This will delete ALL completed tasks at once. Continue?');
    if (!shouldDelete) {
      return;
    }
    const completedTasks = tasks.filter(task => task.is_complete);
  
    for (const task of completedTasks) {
      await handleDelete(task.id);
    }
  
    setTasks(tasks.filter(task => !task.is_complete));
  }

  async function handleDelete(id) {
    const {error} = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  }
  

  return (
    <>
    <Stack spacing={2}>
      <Button onClick={deleteCompletedTasks} style={{ backgroundColor: "darkred", color: "white" }}>
        Clear Completed Tasks
      </Button>
      <Button my="md" onClick={() => {
        if (taskLists.length === 0) {
          alert('Please add a task list first!');
          return;
        }
        open();
      }}>
        Add Task
      </Button>
    </Stack>


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
            value={taskListId}
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