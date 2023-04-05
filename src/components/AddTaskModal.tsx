import { Modal, Stack, TextInput, Button, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function AddTaskModal({ tasks, setTasks, taskLists, fetchTasks, selectedTaskList }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState('');
  const [taskListId, setTaskListId] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const today = new Date();
  today.setDate(today.getDate());

  useEffect(() => {
    setTaskListId(taskLists[0]?.id || '');
  }, [opened, taskLists]);

  async function handleAddTask() {
    if (!dueDate) {
      alert('Please select a due date.');
      return;
    }
    const newTask = {
      title,
      task_list_id: taskListId,
      due_date: dueDate?.toISOString()
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
    const completedTasks = tasks.filter(task => task.is_complete);

    if(completedTasks.length < 1){
      alert(`There are no currently completed tasks.`)
      return;
    }

    const shouldDelete = window.confirm('This will delete ALL completed tasks at once. Continue?');
    if (!shouldDelete) {
      return;
    }
    let deletedCount = 0;

    for (const task of completedTasks) {
      await handleDelete(task.id);
      deletedCount++;
    }

    if(deletedCount > 0)
      alert(`Congratulations! ${deletedCount} tasks have been completed and will be removed!`);
    setTasks(tasks.filter(task => !task.is_complete));
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  }


  return (
    <>
      <Stack spacing={2}>
        <Button onClick={deleteCompletedTasks} style={{ backgroundColor: "green", color: "white" }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Select Due Date</h3>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              minDate={today}
            />
          </div>

          <Button ml="auto" onClick={() => handleAddTask()}>
            Create Task
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default AddTaskModal