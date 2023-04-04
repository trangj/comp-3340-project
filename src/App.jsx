import { useEffect, useState } from 'react'
import { AppShell, Button, Container, Flex, Group, Navbar, NavLink, ScrollArea, Space, Stack, Title } from '@mantine/core'
import TaskItem from './components/TaskItem'
import AddTaskModal from './components/AddTaskModal';
import AddTaskListModal from './components/AddTaskListModal';
import { supabase } from './supabase';
import Auth from './components/Auth';


function App() {
  const [tasks, setTasks] = useState([])
  const [taskLists, setTaskLists] = useState([])
  const [selectedTaskList, setSelectedTaskList] = useState(null)
  const [user, setUser] = useState(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser((session && session.user) ?? null)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session && session.user) ?? null)
    })
  }, []);

  useEffect(() => {
    (async function () {
      try {
        if (user) {
          const { data: task_list, error } = await supabase.from('task_list').select('*').eq('user_id', user.id);
          setTaskLists(task_list);
        }
      } catch (err) {
        // handle error
      }
    })();
  }, [user])

  useEffect(() => {
    (async function () {
      try {
        if (selectedTaskList) {
          fetchTasks(selectedTaskList.id)
        } else {
          fetchTasks(-1);
        }
      } catch (err) {
        // handle error
      }
    })();
  }, [user, selectedTaskList])

  async function fetchTasks(taskListId) {
    try {
      if (taskListId != -1) {
        const { data: tasks, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('task_list_id', taskListId);
        setTasks(tasks);
      } else {
        const { data: tasks, error } = await supabase
          .from('tasks')
          .select('*');
        setTasks(tasks);
      }
    } catch (err) {
      // handle error
    }
  }

  async function deleteTaskList(taskListId) {
    const shouldDelete = window.confirm('Are you sure you want to delete this task list? This action cannot be undone.');
    if (!shouldDelete) {
      return;
    }
    const { data, error } = await supabase
      .from('task_list')
      .delete()
      .eq('id', taskListId)
      .single();
    setTaskLists(prevTaskLists => {
      const index = prevTaskLists.findIndex(taskList => taskList.id === taskListId);
      if (index >= 0) {
        const updatedTaskLists = [...prevTaskLists];
        updatedTaskLists.splice(index, 1);
        return updatedTaskLists;
      }
      return prevTaskLists;
    });
  }

  return user ? (
    <AppShell
      navbar={
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section mb="sm">
            <Group>
              <Title order={2} mr="auto">Taskify</Title>
              <Button size={'xs'} onClick={() => supabase.auth.signOut()}>Logout</Button>
            </Group>
          </Navbar.Section>
          <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            <AddTaskListModal taskLists={taskLists} setTaskLists={setTaskLists} />
            <Stack mt="sm">
              <NavLink label="Show all tasks" onClick={() => {
                setSelectedTaskList(null)
              }}
              />
              {
                taskLists.map(taskList => (
                  <NavLink
                    label={taskList.title}
                    active={selectedTaskList && (selectedTaskList.id === taskList.id)}
                    onClick={() => {
                      setSelectedTaskList(taskList)
                      fetchTasks(taskList.id)
                    }}
                  />
                ))
              }
            </Stack>
            &nbsp;&nbsp;
            {
              selectedTaskList && (
                <Button fullWidth onClick={() => {
                  deleteTaskList(selectedTaskList.id)
                }} style={{ backgroundColor: "darkred", color: "white" }}>
                  Delete Selected Task List
                </Button>
              )
            }
          </Navbar.Section>
        </Navbar>
      }
    >
      <Container>
        <Flex justify={'space-between'} align='center'>
          <Title order={3}>
            {(selectedTaskList && selectedTaskList.title) ?? "All tasks"}
          </Title>
          <AddTaskModal tasks={tasks} setTasks={setTasks} taskLists={taskLists} fetchTasks={fetchTasks} selectedTaskList={selectedTaskList} />
        </Flex>
        <Stack>
          {
            tasks.map(task => (
              <TaskItem key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
            ))
          }
        </Stack>
      </Container>      
    </AppShell>
    
  ) : (
    <Auth />
  )
}

export default App
