import './main.scss';
import Layout from './components/Layout.js';
import { GlobalProvider } from './context/GlobalContext';

function App() {
  return ( 
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  );
}

export default App;
