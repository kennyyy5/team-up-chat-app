import './App.css';
import Chatpage from './Pages/Chatpage.jsx';
import Homepage from './Pages/Homepage.jsx';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

