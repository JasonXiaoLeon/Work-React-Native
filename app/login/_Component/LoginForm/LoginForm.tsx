import React, { useState } from 'react';
import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error: string;
  onForgotPassword: () => void;
  onRegister: () => void;
  onSocialLogin: (platform: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, onForgotPassword, onRegister, onSocialLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.avatarWrap}>
          <Image source={require('../../../../assets/images/logo.webp')} style={styles.avatar} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputForm}>
          <TextInput
            style={styles.input}
            placeholder="用户名"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>登录</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={onForgotPassword} style={styles.linkButton}>
            <Text style={styles.linkText}>忘记密码？</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRegister} style={styles.linkButton}>
            <Text style={styles.linkText}>注册账号</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>快速登录</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialLoginContainer}>
          {['GitHub', 'Google', 'Apple', 'WeChat'].map((platform) => (
            <TouchableOpacity
              key={platform}
              style={styles.socialButton}
              onPress={() => onSocialLogin(platform)}
            >
              <Text style={styles.socialButtonText}>{platform}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    paddingTop: '20%',
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 115,
  },
  inputForm: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '95%',
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 5,
    fontSize: 16,
  },
  button: {
    width: '95%',
    height: 50,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  linkContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  linkButton: {
    width: '30%',
    alignItems: 'center',
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 16,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  socialButton: {
    width: 80,
    height: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    flex: 1,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#333',
  },
});

export default LoginForm;
