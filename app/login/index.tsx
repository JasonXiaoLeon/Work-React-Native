import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // 使用expo-secure-store
import React, { useEffect, useState } from 'react';
const LoginForm = require('./_Component/LoginForm/LoginForm').default;

export default function LoginScreen() {
  const [error, setError] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const credentials = await SecureStore.getItemAsync('jwt');
        if (credentials) {
          router.replace('/home');
        } else {
          console.log('No token found in SecureStore');
        }
      } catch (error) {
        console.error('Error checking token in SecureStore:', error);
      }
    };
    checkToken();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await SecureStore.setItemAsync('jwt', data.token);
        router.replace('/home');
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      console.error('Error during login:', err);
      router.replace('/home');
      setError('网络错误或服务器未响应');
    }
  };

  const handleForgotPassword = () => {
    alert('跳转到忘记密码页面');
  };

  const handleRegister = () => {
    alert('跳转到注册页面');
  };

  const handleSocialLogin = (platform: string) => {
    alert(`通过 ${platform} 登录`);
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      error={error}
      onForgotPassword={handleForgotPassword}
      onRegister={handleRegister}
      onSocialLogin={handleSocialLogin}
    />
  );
}
