import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast()
    const {selectedChat, setSelectedChat, user} = ChatState()

    const handleRemove = async (user1) => {

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
    //   console.log(user1._id)
    //   console.log(user._id)
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

    const handleAddUser =async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title: "User already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return
        }

        try{
            setLoading(true)

            const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`/api/chat/groupadd`,{
        chatId: selectedChat._id,
        userId: user1._id
      } ,config);

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
        } catch(err){
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status:"error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
        }
    }

    const handleRename = async()=>{
        if(!groupChatName) return

        try{
            setRenameLoading(true)

            const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put("/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName
      },config);

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
        } catch(err){
            toast({
                title: "Error Occured!",
                 description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch =async(query)=>{
         setSearch(query)
        if(!query){
            return;
        }

        try{
            setLoading(true)

        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data)
      setLoading(false)
      setSearchResult(data)
        } catch(err){
            toast({
        title: "Error Occured!",
        description: "Failed to Load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        }
    }
  return (
    <>
      <IconButton onClick={onOpen} display={{base:"flex"}} icon={<ViewIcon/>} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} fontFamily={"Anek Devanagari"} display={"flex"} justifyContent={"center"}>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
            {selectedChat.users.map((u)=>(
                <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=>handleRemove(u)}
                />
            ))}
           </Box>
           <FormControl display={"flex"} >
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                mb={2}
                isLoading={renameLoading}
                onClick={handleRename}
                
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (<Spinner size={"lg"}/>) : (searchResult?.map((user)=>(
                <UserListItem key={user._id} user={user} handleFunction={()=> handleAddUser(user)}/>
            )))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
         
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal