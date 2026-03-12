import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Descomente se for usar Autenticação

// As variáveis de ambiente devem ser configuradas no seu arquivo .env ou .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBbGpQ0eH-NHHGaEHfzzToBn68t9-GEz_U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "analise-fretes-ea521.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "analise-fretes-ea521",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "analise-fretes-ea521.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "302325896758",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:302325896758:web:ae6c9cad1f99012547ea97"
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
