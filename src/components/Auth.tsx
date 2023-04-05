import { Button, Container, Stack, Tabs, TextInput, Title } from '@mantine/core'
import React, { useState } from 'react'
import { supabase } from '../supabase';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const {error} = await supabase.auth.signInWithPassword({ email: email, password: password })
    } catch (err) {
      // handle err
    }
  }

  const handleRegisterSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const {error} = await supabase.auth.signUp({ email: email, password: password })
    } catch (err) {
      // handle err
    }
  }

  return (
    <Container>
      <Title my="xl">Taskify</Title>
      <Tabs defaultValue="login">
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="login">
          <form onSubmit={handleLoginSubmit}>
            <Stack>
              <Title order={2} my="xl">Login</Title>
              <TextInput value={email} onChange={e => setEmail(e.target.value)} label="Email" />
              <TextInput type="password" value={password} onChange={e => setPassword(e.target.value)} label="Password" />
              <Button type='submit'>Login</Button>
            </Stack>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="register">
          <form onSubmit={handleRegisterSubmit}>
            <Stack>
              <Title order={2} my="xl">Register</Title>
              <TextInput value={email} onChange={e => setEmail(e.target.value)} label="Email" />
              <TextInput type="password" value={password} onChange={e => setPassword(e.target.value)} label="Password" />
              <Button type='submit'>Register</Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default Auth