import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React,{useState} from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
//import { ChatState } from "../../Context/ChatProvider";
const Login = () => {
  
    
    const [email, setEmail]= useState()

    const [password, setPassword]= useState()
  
    const [show, setShow]= useState(false)

    const handleClick = () => setShow(!show)
    const toast = useToast()
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    //const { setUser } = ChatState();

    const submitHandler = async() => {
        setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      //setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats")
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
    }
  return (
    <VStack spacing="5px" >
        

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={show ? "text" : "password"} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>


        <Button colorScheme='teal' color="white" width="100%" style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>
            Sign in
        </Button>
    </VStack>
  )
}

export default Login