import React, { useContext } from 'react';
import {
  NOT_LOGGED_IN,
  LOG_IN_FORM,
  SIGN_UP_FORM,
  LOGGED_IN,
} from '../constants/AuthStatus';
import AuthNotLoggedIn from './AuthNotLoggedIn';
import AuthSignup from './AuthSignup';
import AuthLogin from './AuthLogin';
import AuthLogout from './AuthLogout';
import { AppContext } from '../contexts/AppContext';

// authStatusの状態によって、コンポーネントの出し分けを実施する
// ダッシュボード
// ログイン
// サインアップ
// ログアウト
const AppContainer = () => {
  // コンテキスト内の状態にアクセス
  const appContext = useContext(AppContext);
  const { authStatus } = appContext;
  const slowNotLoggedIn = authStatus === NOT_LOGGED_IN ? '' : 'hidden';
  const slowLoginForm = authStatus === LOG_IN_FORM ? '' : 'hidden';
  const slowSignupForm = authStatus === SIGN_UP_FORM ? '' : 'hidden';
  const slowLoggedIn = authStatus === LOGGED_IN ? '' : 'hidden';

  return (
    <div className="w-full">
      <div className={slowNotLoggedIn + 'justify-end py-4'}>
        <AuthNotLoggedIn />
      </div>
      <div className={slowLoginForm + 'justify-end py-4'}>
        <AuthLogin option="login" />
      </div>
      <div className={slowSignupForm + 'justify-end py-4'}>
        <AuthSignup option="signup" />
      </div>
      <div className={slowLoggedIn + 'justify-end py-4'}>
        <AuthLogout />
      </div>
    </div>
  );
};

export default AppContainer;
