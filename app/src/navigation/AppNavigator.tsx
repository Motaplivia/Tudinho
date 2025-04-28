/**
 * AppNavigator.tsx
 * 
 * Este arquivo define a navegação principal do aplicativo usando React Navigation.
 * Configura as rotas disponíveis e suas respectivas telas.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das telas do aplicativo
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme/colors';

// Criação do navegador de pilha (stack navigator)
const Stack = createNativeStackNavigator();

/**
 * Componente principal de navegação
 * Define todas as rotas disponíveis no aplicativo e suas configurações
 */
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // Tela inicial do aplicativo
        screenOptions={{
          headerShown: false, // Oculta o cabeçalho padrão
          contentStyle: { backgroundColor: colors.background }, // Cor de fundo padrão
        }}
      >
        {/* Tela de Splash - Primeira tela exibida ao abrir o app */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Tela de Login - Autenticação do usuário */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Tela de Registro - Criação de nova conta */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Tela de Recuperação de Senha */}
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* Tela Principal - Dashboard de tarefas */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Tela de Adição de Tarefa */}
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        
        {/* Tela de Perfil do Usuário */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        
        {/* Tela de Configurações */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 