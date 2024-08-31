import { ViewIcon } from '@chakra-ui/icons'
import { Badge, Button, IconButton, Image, useDisclosure, VStack, Wrap } from '@chakra-ui/react'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({user, children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
  console.log("user", user)

  return (
    <>
      {
        children ? (<span onClick={onOpen}>{children}</span>) : (
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
        )
      }
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" fontFamily="Anek Devanagari" display="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            {/* check img later  */}
            {user.pic ? <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
            /> : <></>}
            
            
              <VStack spacing={2} align="center">
              {user?.career?.map((c, index) => (
                <Badge key={index} colorScheme='teal' m={2}>
                  {c}
                </Badge>
              ))}
            </VStack>
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal