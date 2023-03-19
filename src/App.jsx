import { useEffect, useState } from 'react'
import { AppShell, Button, Container, Navbar, NavLink, ScrollArea, Stack, Title } from '@mantine/core'
import TaskItem from './components/TaskItem'
import AddTaskModal from './components/AddTaskModal';
import AddTaskListModal from './components/AddTaskListModal';

function App() {
  const [tasks, setTasks] = useState([])
  const [taskLists, setTaskLists] = useState([])

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      const savedTaskLists = localStorage.getItem("taskLists");
      setTasks(JSON.parse(savedTasks) || []);
      setTaskLists(JSON.parse(savedTaskLists) || []);
    } catch (err) {
      alert("Error fetching saved tasks")
      localStorage.clear()
    }
  }, [])

  function filterTasks(taskListId) {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (taskListId == null) {
      setTasks(savedTasks)
    } else {
      setTasks(savedTasks.filter(tasks => tasks.taskListId !== taskListId))
    }
  }

  return (
    <AppShell
      navbar={
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section mb="sm"><Title order={2}>Taskify</Title></Navbar.Section>
          <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            <AddTaskListModal taskLists={taskLists} setTaskLists={setTaskLists} />
            <Stack mt="sm">
              <NavLink label={"Show All"} onClick={() => filterTasks()} />
              {
                taskLists.map(taskList => (
                  <NavLink label={taskList.title} onClick={() => {
                    filterTasks(taskList.id)
                  }} />
                ))
              }
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
    >
      <Container>
        <AddTaskModal tasks={tasks} setTasks={setTasks} taskLists={taskLists}/>
        <Stack>
          {
            tasks.map(task => (
              <TaskItem key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
            ))
          }
        </Stack>
      </Container>
    </AppShell>
  )
}

export default App
