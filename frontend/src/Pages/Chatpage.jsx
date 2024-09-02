import React, { useState } from 'react'

import { ChatState } from '../Context/ChatProvider.js'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/misc/SideDrawer.jsx'
import ChatBox from '../components/ChatBox.jsx'
import MyChats from '../components/MyChats.jsx'

const Chatpage = () => {
    const {user} = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div style={{width:"100%"}}>
    {user && <SideDrawer/>} 

    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
     {user && <MyChats fetchAgain={fetchAgain}  />}
     {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
    </Box>

    </div>
  )
}

export default Chatpage