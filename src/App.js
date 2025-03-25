import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  SignIn
} from "@clerk/clerk-react";
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="header">
        <h1>Task Manager</h1>
        <SignedIn>
          <div className="user-controls">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
      
      <SignedIn>
        <div className="task-container">
          <TaskInput />
          <TaskList />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="auth-container">
          <SignIn redirectUrl="/" />
        </div>
      </SignedOut>
    </div>
  );
};

export default App;


