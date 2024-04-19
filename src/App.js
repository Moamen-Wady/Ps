import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles.css'
import Home from './Home';
import Book from './Book';
import Asset from './asset';
import Dashboard from './dashboard';

function App() {
  useEffect(
    () => {
      if ( navigator.userAgent.match( /samsung/i ) ) {
        alert( "Your browser (Samsung Internet) may not show this website's colors correctly in Dark Mode with setting: 'use dark mode: always/when phone dark mode is on' or when option: 'dark theme sites' is checked. Please choose 'light theme websites' or consider using a standards-compliant browser instead. \n\n" +
          "We recommend Firefox, Microsoft Edge, or Google Chrome." );
      };
      window.scrollTo( 0, 0 );
    }
    , []
  )
  return (
    <Router>
      <Routes>
        <Route path='/index' element={ <Home /> } />
        <Route path='/home' element={ <Home /> } />
        <Route path='/' element={ <Home /> } />
        <Route path='/book' element={ <Book /> } />
        <Route path='/dbrd' element={ <Dashboard /> } />
        <Route path='/book/:type/:no' element={ <Asset /> } />
      </Routes>
    </Router >
  );
}
export default App;