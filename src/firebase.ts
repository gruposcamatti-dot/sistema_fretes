import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Descomente se for usar Autenticação

// As variáveis de ambiente devem ser configuradas no seu arquivo .env ou .env.local
// Diagnóstico e carregamento robusto
const getFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn(`AVISO: As seguintes chaves do Firebase estão ausentes: ${missingKeys.join(', ')}`);
    console.warn("Certifique-se de que as variáveis de ambiente VITE_FIREBASE_* estão configuradas no Vercel.");
  } else {
    console.log("Firebase inicializado com sucesso para o projeto:", config.projectId);
  }

  return config;
};

const firebaseConfig = getFirebaseConfig();

// Inicializa o Firebase (apenas se tiver ao menos a apiKey)
let app;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error("ERRO: Firebase não pôde ser inicializado - API Key ausente.");
  }
} catch (error) {
  console.error("Erro ao inicializar o Firebase:", error);
}

// Inicializa o Firestore (Banco de Dados em Nuvem)
export const db = getFirestore(app);

// Exporta o app caso precise em outro lugar
export default app;
