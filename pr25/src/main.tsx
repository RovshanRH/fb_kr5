import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import MainPage from './MainPage.tsx'
// import App from './App.tsx';
const App = lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div>Загрузка</div>}>
  <App />
</Suspense>

)
