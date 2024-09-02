import './App.css';
import Chatpage from './Pages/Chatpage.jsx';
import Homepage from './Pages/Homepage.jsx';
import { Route,  Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Homepage />} exact/>
      <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
