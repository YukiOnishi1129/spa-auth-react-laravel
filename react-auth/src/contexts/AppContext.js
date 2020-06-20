import React, { useState } from 'react';
import axios from 'axios';
import {
  NOT_LOGGED_IN,
  LOG_IN_FORM,
  SIGN_UP_FORM,
  LOGGED_IN,
} from '../constants/AuthStatus';

// Context APIのProviderとcreateContextを定義
// stateとメソッドを定義

const AppContext = React.createContext();

const AppProvider = (props) => {
  let hostName = '';
  //   if (process.env.NODE_ENV === 'development') {
  //     hostName = 'http://localhost';
  //   } else {
  //     hostName = '';
  //   }
  hostName = 'http://localhost:80/';

  const [authStatus, setAuthStatus] = useState(NOT_LOGGED_IN);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const changeAuthStatusLogin = () => {
    setAuthStatus(LOG_IN_FORM);
  };

  const changeAuthStatusSignup = () => {
    setAuthStatus(SIGN_UP_FORM);
  };

  const handleUserNameInput = (changeEvent) => {
    let updateUserName = changeEvent.target.value;
    setUserNameInput(updateUserName);
  };

  const handleUserEmail = (changeEvent) => {
    let updatedUserEmail = changeEvent.target.value;
    setUserEmail(updatedUserEmail);
  };

  const handleUserPassword = (changeEvent) => {
    let updatedUserPassword = changeEvent.target.value;
    setUserPassword(updatedUserPassword);
  };

  const getUser = () => {
    axios.defaults.withCredentials = true;
    axios.get(hostName + 'api/user').then(
      (response) => {
        console.log('認証OK');
        console.log(response);
        setUserId(response.data.id);
        setUserName(response.data.name);
        setErrorMessage('');
        setAuthStatus(LOGGED_IN);
      },
      // GET USER ERROR
      (error) => {
        console.log('テスト');
        console.log(error.response);
        setErrorMessage('GET USER ERROR：Could not complete the sign up');
      }
    );
  };

  const signup = () => {
    axios.defaults.withCredentials = true;
    // CSRF COOKIE
    // csrf cookieを作成し取得
    axios.get(hostName + 'sanctum/csrf-cookie').then(
      (response) => {
        console.log(response);
        //   SIGNUP / REGISTER
        // 会員登録処理
        axios
          .post(hostName + 'api/register', {
            name: userNameInput,
            email: userEmail,
            password: userPassword,
          })
          .then(
            (response) => {
              console.log('registerOK');
              console.log(response);
              // GET USER
              //   ユーザー情報を取得
              axios.get(hostName + 'api/user').then(
                (response) => {
                  console.log('認証OK');
                  console.log(response);
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setErrorMessage('');
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                  console.log('テスト');
                  console.log(error.response);
                  setErrorMessage(
                    'GET USER ERROR：Could not complete the sign up'
                  );
                }
              );
            },
            // SIGNUP ERROR
            (error) => {
              // プロパティ有無の判別方法
              //https://qiita.com/rymiyamoto/items/be91b04f70de2b621bb3
              if ('name' in error.response.data.errors) {
                //   nameのバリデーションエラー
                setErrorMessage(error.response.data.errors.name[0]);
              } else if ('email' in error.response.data.errors) {
                // emailのバリデーションエラー
                setErrorMessage(error.response.data.errors.email[0]);
              } else if ('password' in error.response.data.errors) {
                // passswordのバリデーションエラー
                setErrorMessage(error.response.data.errors.password[0]);
              } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage('SIGNUP ERROR：Could not complete the sign up');
              }
            }
          );
      },
      // COOKIE ERROR
      (error) => {
        console.log(error);
        setErrorMessage('COOKIE ERROR：Could not complete the sign up');
      }
    );
  };

  const login = () => {
    axios.defaults.withCredentials = true;
    //   CSRF COOKIE
    axios.get(hostName + 'sanctum/csrf-cookie').then(
      (response) => {
        console.log(response);
        // LOGIN
        axios
          .post(hostName + 'api/login', {
            email: userEmail,
            password: userPassword,
          })
          .then(
            (response) => {
              console.log(response);
              // GET USER
              axios.get(hostName + 'api/user').then(
                (response) => {
                  console.log(response);
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setErrorMessage('');
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                  setErrorMessage(
                    'GET USER ERROR：Could not complete the login'
                  );
                }
              );
            },
            //   LOGIN ERROR
            (error) => {
              if (error.response) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage('LOGIN ERROR：Could not complete the login');
              }
            }
          );
      },
      //   COOKIE ERROR
      (error) => {
        console.log(error.response);
        setErrorMessage('COOKIE ERROR：Could not complete the login');
      }
    );
  };

  const logout = () => {
    axios.defaults.withCredentials = true;
    axios.post(hostName + 'api/logout').then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error.response);
      }
    );
    setUserId(0);
    setUserName('');
    setUserNameInput('');
    setUserEmail('');
    setUserPassword('');
    setAuthStatus(NOT_LOGGED_IN);
  };

  return (
    <AppContext.Provider
      value={{
        authStatus,
        changeAuthStatusLogin,
        changeAuthStatusSignup,
        userId,
        userName,
        userNameInput,
        userEmail,
        userPassword,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        getUser,
        signup,
        login,
        logout,
        errorMessage,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
