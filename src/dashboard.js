import React, { useCallback, useEffect, useState } from 'react'
import api from './api'
import "./styles.css"
var timePeriods = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30"
]
// API CALLS
const getResvs = async ( type, num, cb ) => {
    await api.get( '/getall' ).then( ( data ) => {
        if ( data.data.sts !== 'ok' ) { alert( 'network error' ); return }
        else { cb( data.data.all ) }
    } ).catch( ( err ) => alert( err ) )
}
const changer = async ( type, num, name, tp, date, color, cb, getcb, clearCb, admin ) => {
    await api.put( `/${ type }/${ color.slice( 0, 1 ) }`, {
        num: num,
        tp: tp,
        name: name,
        color: color,
        admin: admin,
        date: date
    } ).then( async ( data ) => {
        if ( data.data.sts == 'ok' ) {
            await getcb( type, num, cb )
            alert( 'saved' );
            clearCb()
        }
        else {
            if ( data.data.err == 'tp' ) {
                await getcb( type, num, cb )
                alert( 'We are sorry, the time periods was just reserved , please try again' )
                clearCb()
            }
            else { alert( data.data.err ) }
        }
    } )
        .catch( err => alert( err ) )
}
// PROPERTIES AND STATES MODIFIERS
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
const typerr = ( e, cb1, cb2 ) => {
    cb1( e.target.slot )
    cb2( {
        Reservations: {},
        num: 0
    } )
}
const Objecter = ( item, cb ) => {
    cb( item )
}
//SLIDER
function cliprv( cli ) {
    if ( cli == 1 ) {
        document.getElementById( `sslide8` ).style.animationName = 'gotoleft'
    }
    else {
        document.getElementById( `sslide${ cli - 1 }` ).style.animationName = 'gotoleft'
    }
}
function clinxt( cli ) {
    if ( cli == 7 ) {
        document.getElementById( `sslide${ cli }` ).style.animationName = 'midtoleft'
        document.getElementById( `sslide${ cli + 1 }` ).style.animationName = 'righttomid'
        document.getElementById( `sslide${ 1 }` ).style.animationName = 'comefromright'
    }
    else if ( cli == 8 ) {
        document.getElementById( `sslide${ cli }` ).style.animationName = 'midtoleft'
        document.getElementById( `sslide${ 1 }` ).style.animationName = 'righttomid'
        document.getElementById( `sslide${ 2 }` ).style.animationName = 'comefromright'
    }
    else {
        document.getElementById( `sslide${ cli }` ).style.animationName = 'midtoleft'
        document.getElementById( `sslide${ cli + 1 }` ).style.animationName = 'righttomid'
        document.getElementById( `sslide${ cli + 2 }` ).style.animationName = 'comefromright'
    }
}
function nclincr( cli, cb ) {
    if ( cli == 8 ) { cb( 1 ); }
    else { cb( cli + 1 ); }
}
function xcliprv( cli ) {
    if ( cli == 8 ) {
        document.getElementById( `sslide1` ).style.animationName = 'gotoright'
    }
    else {
        document.getElementById( `sslide${ cli + 1 }` ).style.animationName = 'gotoright'
    }
}
function xclinxt( cli ) {
    if ( cli == 1 ) {
        document.getElementById( `sslide7` ).style.animationName = 'comefromleft'
        document.getElementById( `sslide8` ).style.animationName = 'lefttomid'
        document.getElementById( `sslide1` ).style.animationName = 'midtoright'
    }
    else if ( cli == 2 ) {
        document.getElementById( `sslide8` ).style.animationName = 'comefromleft'
        document.getElementById( `sslide1` ).style.animationName = 'lefttomid'
        document.getElementById( `sslide2` ).style.animationName = 'midtoright'
    }
    else {
        document.getElementById( `sslide${ cli - 2 }` ).style.animationName = 'comefromleft'
        document.getElementById( `sslide${ cli - 1 }` ).style.animationName = 'lefttomid'
        document.getElementById( `sslide${ cli }` ).style.animationName = 'midtoright'
    }
}
function nclidcr( cli, cb ) {
    if ( cli == 1 ) { cb( 8 ); }
    else { cb( cli - 1 ); }
}
const clifwd = ( cli, cb ) => {
    cliprv( cli );
    clinxt( cli );
    nclincr( cli, cb );
}
const clibwd = ( cli, cb ) => {
    xcliprv( cli );
    xclinxt( cli );
    nclidcr( cli, cb );
}
export default function Dashboard() {
    // STATES
    var [ date, setDate ] = useState( '' )
    var [ all, setall ] = useState( [] )
    var [ go, setGo ] = useState( false )
    var [ object, setObject ] = useState(
        {
            Reservations: {},
            num: 0
        }
    )
    var [ disabled, setDisabled ] = useState( true )
    var [ fname, setFname ] = useState( 'admin' )
    var [ ftp, setFtp ] = useState( [] )
    var [ type, setType ] = useState( 'ps' )
    var [ cli, setCli ] = useState( 1 )
    useEffect( () => {
        getResvs( '', '', setall )
    }, [ date ] )
    useEffect( () => {
        if ( ftp.length == 0 ) { setDisabled( true ) }
        else { setDisabled( false ) }
    }, [ ftp.length ] )
    //Clear CallBack
    const clear = () => {
        setFtp( [] );
        setFname( 'admin' )
        document.querySelectorAll( 'input.tpchb' ).forEach( ( i ) => {
            i.checked = false
        } )
        document.querySelectorAll( 'input#nameInput' ).forEach( ( i ) => {
            i.value = ''
        } )
    }
    //SLIDER
    const sslider = useCallback(
        () => {
            setTimeout( () => {
                document.getElementById( 'sleft' ).click()
            }, 100 );
        }, []
    )
    return (
        <>
            <div className='fulltablecont'>
                <div className='tabs' style={ { position: 'static' } }>
                    <div className='tab' onClick={ ( e ) => typerr( e, setType, setObject ) } slot='ps'
                        style={ type == 'ps' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='ps'>play station</h2></div>
                    <div className='tab' onClick={ ( e ) => typerr( e, setType, setObject ) } slot='pool'
                        style={ type == 'pool' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='pool'>pool</h2></div>
                    <div className='tab' onClick={ ( e ) => typerr( e, setType, setObject ) } slot='ping'
                        style={ type == 'ping' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='ping'>ping pong</h2></div>
                </div>
                <div className='fulltablecont'>
                    <div className='tabs2'>
                        <button id='sleft' className='homebtn' onClick={ () => clifwd( cli, setCli ) }> <img src='l.png' alt=' ' /> </button>
                        { all?.[ type ]?.sort( ( a, b ) => a.num - b.num ).map( ( item, index ) => {
                            if ( ( index + 1 ) == all?.[ type ]?.length ) {
                                if ( !go ) {
                                    setGo( true );
                                    sslider()
                                }
                            }
                            return (
                                <button className='tab2 sslide' id={ 'sslide' + ( index + 1 ) } key={ item.num } onClick={ () => Objecter( item, setObject ) }
                                    style={ object.num == item.num ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                                    <h2 className='h22'>{ type.toString() + ' no. ' + item.num }</h2>
                                </button>
                            )
                        } ) }
                        <button id='sright' className='homebtn' onClick={ () => clibwd( cli, setCli ) }> <img src='r.png' alt=' ' /> </button>
                    </div>
                </div>
            </div>
            <div className="options">
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Reservations</td>
                            <td>Options</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            object?.Reservations?.[ date ]?.Resvs?.map(
                                ( i ) => {
                                    return (
                                        <tr key={ i.name }>
                                            <td>{ i.name }</td>
                                            <td>{ i.tp.sort().toString().replace( ',', ', ' ) }</td>
                                            <td>
                                                <span
                                                    style={ { all: 'unset', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-evenly' } }>
                                                    <button className='opbt' onClick={ () => changer( type, object.num, i.name, i.tp, date, 'red', setall, getResvs, clear, 1 ) } style={ { display: 'inline' } }>Confirm</button>
                                                    <button className='opbt' onClick={ () => changer( type, object.num, i.name, i.tp, date, 'yellow', setall, getResvs, clear, 1 ) } style={ { display: 'inline' } }>Hold</button>
                                                    <button className='opbt' onClick={ () => changer( type, object.num, i.name, i.tp, date, 'green', setall, getResvs, clear, 1 ) } style={ { display: 'inline' } }>Cancel</button>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                <input type='date' className='date1' name='date' id='date' onChange={ ( e ) => changeDate( e, setDate, clear ) } placeholder='Choose Date' />
                <form id='times'>
                    <div className='timePeriods' >
                        {
                            timePeriods.map( ( period ) => {
                                return (
                                    <label className="container" key={ period }
                                        style={ {
                                            pointerEvents: cellCheck( object, period, date ),
                                            backgroundColor: 'whitesmoke'
                                        } }>
                                        { ' ' + period + ' ' }
                                        <input type="checkbox" className='tpchb' disabled={ date == '' ? true : false } onChange={ ( e ) => onCheck( e, ftp, period, setFtp ) }
                                            style={ {
                                                pointerEvents: cellCheck( object, period, date ),
                                                backgroundColor: cellColor( object, period, date )
                                            } } />
                                        <span className="checkmark"
                                            style={ {
                                                pointerEvents: cellCheck( object, period, date ),
                                                backgroundColor: cellColor( object, period, date )
                                            } }
                                        ></span>
                                    </label>
                                )
                            } )
                        }
                    </div>
                </form>
                <input type='text' className='nameInput' id='nameInput' placeholder='admin' onChange={ ( e ) => changeName( e, setFname ) } disabled={ disabled } />
                <button className='opbt' onClick={ () => changer( type, object.num, fname, ftp, date, 'red', setall, getResvs, clear, 1 ) } style={ { display: 'inline' } }>Confirm</button>
                <button className='opbt' onClick={ () => changer( type, object.num, fname, ftp, date, 'yellow', setall, getResvs, clear, 1 ) } style={ { display: 'inline' } }>Hold</button>
            </div>
        </>
    )
}