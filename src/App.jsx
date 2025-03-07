import './App.css'
import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ChattingPage from './page/ChattingPage';
import MainPage from './page/MainPage';
import { ToastContainer } from "react-toastify";
import AuthPage from './page/AuthPage';
import SocialKakao from './components/AuthPageComponents/SocialKakao';
import SocialNaver from './components/AuthPageComponents/SocialNaver';
import PlacePage from './page/PlacePage';
import MyPage from './page/MyPage';
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
    path : '/oauth/kakao',
    element : <SocialKakao/>
  },
  {
    path : '/oauth/naver',
    element : <SocialNaver/>
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
  {
    path : '/me',
    element: (
      <ProtectedRoute>
        <MyPage />
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
