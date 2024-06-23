import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api';
import './styles.css'
import Home from './Home';
import Book from './Book';
import Asset from './asset';
import Dashboard from './dashboard';
function dummy( x ) {
  return
} const getResvs = async ( type, num, cb, monitor, monitorcb, alertcb ) => {
  await api.get( `/getall` )
    .then(
      ( data ) => {
        if ( data.data.sts !== 'ok' ) { alertcb( 'error', 'network error' ) }
        else { cb( data.data.all ); monitorcb() }
      } )
    .catch( () => { alertcb( 'error', 'network error' ) } )
}
const getObject = async ( type, num, cb, monitor, monitorcb, alertcb ) => {
  await api.get( `/${ type }/${ num }` )
    .then(
      ( data ) => {
        if ( data.data.sts !== 'ok' ) { alertcb( 'error', 'network error' ) }
        else { cb( data.data.object ) }
      } )
    .catch( () => { alertcb( 'error', 'network error' ) } )
}
const changeName = ( e, cb ) => {
  cb( e.target.value )
}
const onCheck = ( e, tp, item, cb ) => {
  if ( e.target.checked ) {
    e.target.checked = true
    cb( [ ...tp, item ] )
  }
  else {
    e.target.checked = false
    cb( tp.filter( ( currItem ) => currItem !== item ) )
  }
}
const changeDate = ( e, cb, clearCb ) => {
  cb( e.target.value )
  clearCb()
}
const cellColor = ( object, period, date ) => {
  if ( object?.Reservations?.[ date ]?.yellow?.includes( period ) ) { return 'yellow' }
  else if ( object?.Reservations?.[ date ]?.red?.includes( period ) ) { return 'red' }
  else { return 'limegreen' }
}
const cellCheck = ( object, period, date ) => {
  if ( object?.Reservations?.[ date ]?.yellow?.includes( period ) ) { return 'none' }
  else if ( object?.Reservations?.[ date ]?.red?.includes( period ) ) { return 'none' }
  else { return 'all' }
}
const changer = async ( type, num, name, tp, date, color, cb, getcb, monitor, monitorcb, clearCb, admin, alertcb ) => {
  await api.put( `/${ type }/${ color.slice( 0, 1 ) }`, {
    num: num,
    tp: tp,
    name: name,
    color: color,
    admin: admin,
    date: date
  } ).then( async ( data ) => {
    if ( data.data.sts == 'ok' ) {
      await getcb( type, num, cb, monitor, monitorcb, alertcb )
      clearCb()
      alertcb( 'success', 'Your Reservation Was Saved' )
    }
    else {
      if ( data.data.err == 'tp' ) {
        await getcb( type, num, cb, monitor, monitorcb, alertcb )
        clearCb()
        alertcb( 'error', 'We are sorry, the time periods were just reserved By another User, please try again' )
      }
      else { alertcb( 'error', data.data.err ) }
    }
  } )
    .catch( err => alertcb( 'error', err ) )
}

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
  const notify = ( e, msg ) => {
    toast[ e ]( msg, {
      position: "top-right",
      autoClose: 2200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    } )
  }
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/index' element={ <Home notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
        <Route path='/home' element={ <Home notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
        <Route path='/' element={ <Home notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
        <Route path='/book' element={ <Book notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
        <Route path='/dbrd' element={ <Dashboard notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
        <Route path='/book/:type/:no' element={ <Asset notify={ notify } changeName={ changeName } onCheck={ onCheck } changeDate={ changeDate } cellColor={ cellColor } cellCheck={ cellCheck } changer={ changer } getResvs={ getResvs } getObject={ getObject } dummy={ dummy } /> } />
      </Routes>
    </Router >
  );
}
export default App;