import { Button, Checkbox, CheckboxGroup, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightElement, VStack, Wrap } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import React,{useState} from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name, setName]= useState()
    const [email, setEmail]= useState()
    const [confirmPassword, setConfirmPassword]= useState()
    const [password, setPassword]= useState()
    const [pic, setPic]= useState(null)
    const [career, setCareer]= useState([])
    const [show, setShow]= useState(false)
    const [loading, setLoading]= useState(false)
    const toast = useToast()
    const navigate = useNavigate()
    //console.log(careerCheckbox)

    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if(!pics){
            toast({
          title: 'Please select an image!',
          
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        })
        setLoading(false)
        return
        }

        if(pics.type === "image/jpeg" || pics.type==="image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "team-up");
            data.append("cloud_name","duxayk4lm")
            fetch("https://api.cloudinary.com/v1_1/duxayk4lm/image/upload",{
                method: "post",
                body:data
            }).then((res)=>res.json())
            .then(data => {
                setPic(data.url.toString())
               // console.log(data.url.toString())
                setLoading(false)
            })
            .catch((err)=>{
                console.error(err)
                setLoading(false)
            })
        } else {
            toast({
                title: "Please select an image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
            return
        }
    }

    const submitHandler = async() => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword ||!career){
            toast({
                title: "Please enter all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
            return
        }

        if(password !== confirmPassword){
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
            return
        }

        try{
            const config = {
                headers: {
                    "Content-Type":"application/json",
                }
            }

            const {data} =  await axios.post("/api/user", {name, email, password, career, pic}, config);
            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)

            navigate("/chats")
        } catch(err){
            toast({
                title:"Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }




    }
  return (
    <VStack spacing="5px" >
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)} />
        </FormControl>

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

        <FormControl id='password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input type={show ? "text" : "password"} placeholder='Confirm password' onChange={(e)=>setConfirmPassword(e.target.value)} />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl as='fieldset'>
        <FormLabel as='legend'>Career path</FormLabel>
        <CheckboxGroup onChange={(e)=>setCareer(e)}>
            <Wrap spacing='24px'>
            <Checkbox value='Software Development and Engineering'>Software Development and Engineering</Checkbox>
            <Checkbox value='Data and Analytics'>Data and Analytics</Checkbox>
            <Checkbox value='Cybersecurity'>Cybersecurity</Checkbox>
            <Checkbox value='Cloud Computing'>Cloud Computing</Checkbox>
            <Checkbox value='Networking and Systems Administration'>Networking and Systems Administration</Checkbox>
            <Checkbox value='Product and Project Management'>Product and Project Management</Checkbox>
            <Checkbox value='UX/UI Design'>UX/UI Design</Checkbox>
            <Checkbox value='Artificial Intelligence and Robotics'>Artificial Intelligence and Robotics</Checkbox>
            <Checkbox value='Web Development'>Web Development</Checkbox>
            <Checkbox value='App Development'>App Development</Checkbox>
            <Checkbox value='Consulting and Advisory'>Consulting and Advisory</Checkbox>
            <Checkbox value='Database Administration'>Database Administration</Checkbox>
            <Checkbox value='Quality Assurance (QA)'>Quality Assurance (QA)</Checkbox>
            <Checkbox value='Site Reliability'>Site Reliability</Checkbox>
             <Checkbox value='Technical writing'>Technical writing</Checkbox>
            </Wrap>
        </CheckboxGroup>
        <FormHelperText>Select all valid options. </FormHelperText>
        </FormControl>

        <FormControl id='pic'>
            <FormLabel>Upload your picture</FormLabel>
            <Input  onChange={(e)=>postDetails(e.target.files[0])} type='file' p={1.5} accept='image/*' className='upload' />
        </FormControl>

        <Button colorScheme='teal' color="white" width="100%" style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>
            Sign up
        </Button>
    </VStack>
  )
}

export default Signup