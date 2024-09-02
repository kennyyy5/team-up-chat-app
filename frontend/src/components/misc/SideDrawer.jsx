import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState} from 'react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import { Badge } from '@chakra-ui/react'


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
  //  const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()


    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const toast = useToast()


        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/user`, config);
                setSearchResult(data);
            } catch (err) {
                toast({
                    title: 'Error Occurred!',
                    description: 'Failed to load the search results!',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            } finally {
                setLoading(false);
            }
        };

    const handleSearch = async() => {
       if(!search){
        toast({
            title:"You need to search for something!",
            status:"warning",
            duration:5000,
            isClosable: true,
            position:"bottom-left"
        })
        return
       }
       try{
        setLoading(true)
        const config ={
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data} = await axios.get(`/api/user?search=${search}`, config)

        setLoading(false)
        setSearchResult(data)
       } catch(err){
        toast({
            title: "Error Occured!",
            description: 'Failed to load the search results!',
            status:'error',
            duration:5000,
            isClosable: true,
            position:"bottom-left"
        })
       }
    }

    const accessChat = async(userId)=>{
        try{
            setLoadingChat(true)

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/api/chat", {userId}, config)
            if (!chats.find((c)=> c._id===data._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch(err){
        console.log(err.message)
        
        }
    }
  
  return (
    <>
        <Box
         display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        >
            <Tooltip label="Search for users to connect with" hasArrow placement='bottom-end'>
                <Button variant="ghost" onClick={() => {
     onOpen();
    fetchSearchResults(); // Call the fetchSearchResults function
    // Call the onOpen function
  }} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                    <Text display={{ base: "none", md: "flex" }} px="2">Search User</Text>
                </Button>
            </Tooltip>

            <Text fontSize="2xl" fontFamily="Anek Devanagari">
                Team Up
            </Text>

            <div>
                <Menu>
                    <MenuButton p={1} >
                        
                       <Box position="relative" display="inline-block" >
      <BellIcon boxSize={6} />
      {notification.length > 0 && (
        <Badge
          colorScheme="teal"
          borderRadius="full"
          position="absolute"
          top="-1"
          right="-1"
          px="1"
          fontSize="sm"
        >
          {notification.length}
        </Badge>
      )}
    </Box>
                        
                    </MenuButton>
                    <MenuList pl={2}>

                        {!notification.length && "No New Messages"}
                        {notification?.map(notif =>(
                            <MenuItem key={notif._id} onClick={()=>{
                                
                                setSelectedChat(notif.chat)
                                setNotification(notification.filter((n)=>n!==notif))
                               console.log(notif)
                            }}>
                                {notif.chat.isGroupChat ? (
                                    `New Message in ${notif.chat.chatName}`
                                ):(
                                    `New Message from ${getSender(user, notif.chat.users)}`
                                )}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                        <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider/>
                        <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>


    <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        
        <DrawerBody>
            <Box display={"flex"} pb={2}>
                <Input placeholder='Search by name' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}   />
                <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading/>):(
                Array.isArray(searchResult) ? searchResult?.map(user=>(
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={()=>accessChat(user._id)}
                    />
                )):[]
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
    </Drawer>


    </>
  )
}

export default SideDrawer