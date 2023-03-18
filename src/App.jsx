import { useState } from 'react'
import { Container, Stack, Title } from '@mantine/core'
import TaskItem from './components/TaskItem'
import AddTaskModal from './components/AddTaskModal';

function App() {
  const [tasks, setTasks] = useState([
    {
      id: Date.now(),
      title: "Take out the trash",
      isComplete: false
    }
  ])

  return (
    <Container>
      <Title>Taskify</Title>
      <AddTaskModal tasks={tasks} setTasks={setTasks}/>
      <Stack>
        {
          tasks.map(task => (
            <TaskItem key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
          ))
        }
      </Stack>
    </Container>
  )
}

export default App
