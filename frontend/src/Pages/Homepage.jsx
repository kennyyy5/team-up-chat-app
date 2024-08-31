import React, { useEffect } from 'react'
import {Box, Container, Text} from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate("/chats")
  }, [navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box d="flex" justifyContent="center" p={3} bg= {"white"} w="100%" m = "40px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl" fontFamily="Anek Devanagari" color="black" textAlign="center" verticalAlign="center">Team Up</Text>
      </Box>
      <Box bg= {"white"} color="black" w="100%" p={4} borderRadius="lg" borderWidth="1px" m = "40px 0 40px 0">
          <Tabs isFitted variant='enclosed' colorScheme='teal'>
            <TabList mb='1em'>
              <Tab>Login</Tab>
              <Tab>Sign up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/> 
              </TabPanel>
              <TabPanel>
                <Signup/> 
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage