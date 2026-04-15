import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        style={{ zIndex: 10001 }}
        toastClassName="!rounded-2xl !shadow-2xl"
      />
    </>
  );
}

export default App
