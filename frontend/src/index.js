import React from 'react';                        
import ReactDOM from 'react-dom/client';          
import './index.css';                    
import App from './App';                  
import { NotesContextProvider } from './context/NoteContext'  
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(                                                      
  <React.StrictMode>
    <AuthContextProvider>           
     <NotesContextProvider>
       <App />
      </NotesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


