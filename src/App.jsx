import './App.css'
import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ChattingPage from './page/ChattingPage';
import MainPage from './page/MainPage';
import { ToastContainer } from "react-toastify";
import AuthPage from './page/AuthPage';
import PlacePage from './page/PlacePage';
import LoginProvider from './store/LoginProvider';
import ProtectedRoute from './store/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([

  { path : '/' , 
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/auth',
    element : <AuthPage/>
  },
  {
    path : '/chat',
    element: (
      <ProtectedRoute>
        <ChattingPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/place',
    element: (
      <ProtectedRoute>
        <PlacePage />
      </ProtectedRoute>
    ),
  },
]);


function App() {
  
  return (
    <>
      <LoginProvider>
        <ToastContainer 
          toastClassName="custom-toast-container"
          bodyClassName="custom-toast-body"/>
        <RouterProvider router={router}/>
      </LoginProvider>
    </>
  )
}

export default App
