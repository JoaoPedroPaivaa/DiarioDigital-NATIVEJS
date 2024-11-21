import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker'; // Importando a função para escolher a imagem

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Flag para alternar entre login e cadastro
  const [profileImage, setProfileImage] = useState(null); // Estado para armazenar a imagem do perfil
  const navigation = useNavigation(); // Hook de navegação

  // Função de login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Diário');  // Redireciona para a tela de diários
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  // Função de cadastro
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Diário');  // Redireciona para a tela de diários após o cadastro
    } catch (error) {
      alert("Erro ao criar conta: " + error.message);
    }
  };

  // Função de recuperação de senha
  const handlePasswordRecovery = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Instruções de recuperação de senha enviadas para seu e-mail!');
    } catch (error) {
      alert("Erro ao tentar recuperar a senha: " + error.message);
    }
  };

  // Função para selecionar uma nova foto de perfil
  const handleProfileImageChange = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, (response) => {
      if (response.assets) {
        setProfileImage(response.assets[0].uri); // Armazena a URI da imagem selecionada
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Imagem do Perfil */}
      <TouchableOpacity onPress={handleProfileImageChange} style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileImageText}>Escolha uma foto</Text>
        )}
      </TouchableOpacity>

      {/* Título centralizado */}
      <Text style={styles.title}>Querido Diário</Text>
      
      <Text style={styles.subtitle}>{isLogin ? 'Login' : 'Cadastro'}</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Botão de login ou cadastro */}
      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignUp}
      >
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Criar Conta'}</Text>
      </TouchableOpacity>

      {/* Botão para alternar entre login e cadastro */}
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}  // Alterna entre login e cadastro
      >
        <Text style={styles.switchButtonText}>
          {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Fazer Login"}
        </Text>
      </TouchableOpacity>

      {/* Link para recuperação de senha */}
      {isLogin && (
        <TouchableOpacity onPress={handlePasswordRecovery} style={styles.recoveryButton}>
          <Text style={styles.recoveryButtonText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileImageContainer: {
    width: 100, // Largura da área de imagem
    height: 100, // Altura da área de imagem
    borderRadius: 50, // Para deixar a imagem circular
    backgroundColor: '#e0e0e0', // Cor de fundo quando não há imagem
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%', // Ocupa toda a área
    height: '100%', // Ocupa toda a altura
    borderRadius: 50, // Mantém a forma circular
  },
  profileImageText: {
    color: '#888',
    fontSize: 12,
  },
  title: {
    fontSize: 32, // Tamanho maior para o título
    fontWeight: 'bold',
    marginBottom: 30, // Maior espaçamento abaixo do título
    textAlign: 'center',
    color: '#4CAF50', // Cor do título
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '80%',  // Define a largura do botão
    marginBottom: 10, // Espaçamento entre os botões
    alignSelf: 'center', // Centraliza o botão
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  recoveryButton: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recoveryButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
});

export default LoginScreen;
