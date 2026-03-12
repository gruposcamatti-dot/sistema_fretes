import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Descomente se for usar Autenticação

// As variáveis de ambiente devem ser configuradas no seu arquivo .env ou .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Diagnóstico simples para produção (não exibe chaves completas)
if (!firebaseConfig.apiKey) {
  console.error("ERRO CRÍTICO: VITE_FIREBASE_API_KEY não encontrada nas variáveis de ambiente!");
} else {
  console.log("Firebase Config detectada para o projeto:", firebaseConfig.projectId);
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (Banco de Dados em Nuvem)
export const db = getFirestore(app);

// Exporta o app caso precise em outro lugar
export default app;
