# Tudinho - Aplicativo de Gerenciamento de Tarefas

## 📱 Sobre o Projeto
Tudinho é um aplicativo móvel desenvolvido em React Native com Expo para gerenciamento de tarefas pessoais. O aplicativo permite que os usuários criem, editem e organizem suas tarefas diárias de forma eficiente.

## ✨ Funcionalidades
- 🔐 Autenticação de usuários
- 📝 Criação e edição de tarefas
- 📅 Organização por data e urgência
- 🎨 Tema claro/escuro
- 🔔 Notificações de tarefas
- 📊 Estatísticas de produtividade
- 👤 Perfil personalizável

## 🛠️ Tecnologias Utilizadas
- React Native
- Expo
- TypeScript
- Firebase (Authentication e Firestore)
- Expo Router
- React Navigation
- Expo Notifications

## 📋 Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Emulador Android/iOS ou dispositivo físico

### Instalação
1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o Firebase
- Crie um projeto no Firebase Console
- Adicione as configurações do Firebase no arquivo `.env`
- Ative Authentication e Firestore

### Executando o Projeto
1. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

2. Escolha uma das opções para executar o aplicativo:

#### Usando Emulador
1. Certifique-se de ter um emulador Android ou iOS configurado
2. No terminal, após iniciar o servidor, pressione:
   - `a` para abrir no emulador Android
   - `i` para abrir no emulador iOS
   - `w` para abrir no navegador web

#### Usando Dispositivo Físico
1. Instale o aplicativo Expo Go no seu dispositivo móvel
2. Escaneie o QR code que aparece no terminal com:
   - Android: Câmera do dispositivo
   - iOS: Câmera do dispositivo

### Configuração do Emulador
#### Android
1. Instale o Android Studio
2. Crie um dispositivo virtual (AVD) através do AVD Manager
3. Certifique-se de que o emulador está rodando antes de executar o comando `npm start`

#### iOS (apenas macOS)
1. Instale o Xcode
2. Abra o Xcode e instale os componentes necessários
3. Configure um simulador iOS através do Xcode

### Dicas para Desenvolvimento
- Use `r` no terminal para recarregar o aplicativo
- Use `m` para abrir o menu de desenvolvedor
- Use `j` para abrir o debug remoto
- Use `Ctrl + C` para encerrar o servidor

## 📁 Estrutura do Projeto
```
app/
├── src/
│   ├── screens/         # Telas do aplicativo
│   ├── navigation/      # Configuração de navegação
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos do React
│   ├── hooks/           # Hooks personalizados
│   ├── services/        # Serviços e integrações
│   ├── theme/           # Temas e estilos
│   └── utils/           # Funções utilitárias
├── assets/              # Recursos estáticos
└── config/              # Configurações do projeto
```

## 🔐 Configuração do Firebase
1. Crie um projeto no Firebase Console
2. Ative Authentication (Email/Senha)
3. Configure o Firestore com as seguintes regras:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Dependências Principais
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "expo": "^49.x",
    "expo-router": "^2.x",
    "firebase": "^10.x",
    "react": "18.x",
    "react-native": "0.72.x"
  }
}
```

## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte
Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.