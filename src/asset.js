import React, { useState, useEffect } from 'react'
import api from './api'
var timePeriods = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30"
]
const getObject = async ( type, num, cb ) => {
    await api.get( `/${ type }/${ num }` )
        .then(
            ( data ) => {
                if ( data.data.sts !== 'ok' ) { alert( 'network error' ) }
                else { cb( data.data.object ) }
            } )
        .catch( () => { alert( 'network error' ) } )
}
const changer = async ( type, num, name, tp, date, color, cb, getcb, clearCb, admin ) => {
    console.log( type, num, name, tp, date, color, admin )
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
            if ( data.data.err == 'tp' )
                alert( 'We are sorry, the time periods was just reserved , please try again' )
            else if ( data.data.err == 'name' )
                alert( 'We are sorry, the name was just taken , please try again' )
            else { alert( data.data.err.err ) }
        }
    } )
        .catch( err => alert( err ) )
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
export default function Asset() {
    //API CALLS
    const invoicer = ( p ) => {
        setInvoice( p )
        setShow( 'block' )
    }
    var [ object, setObject ] = useState(
        {
            Reservations: {},
            num: 0
        }
    )
    var [ tp, setTp ] = useState( [] )
    var [ date, setDate ] = useState( '' )
    var [ name, setName ] = useState( '' )
    var [ invoice, setInvoice ] = useState( <></> )
    var [ show, setShow ] = useState( 'none' )
    var [ disabled, setDisabled ] = useState( true )
    var href = window.location.href
    var sliced = href.split( '/book/' )
    var infoarr = sliced[ 1 ].split( '/' )
    var type = infoarr[ 0 ]
    var num = infoarr[ 1 ]
    useEffect( () => {
        if ( tp.length == 0 ) { setDisabled( true ) }
        else { setDisabled( false ) }
    }, [ tp.length ] )
    useEffect(
        () => {
            getObject( type, num, setObject )
        }, []
    )
    const clear = () => {
        setTp( [] );
        setName( '' )
        document.querySelectorAll( 'input.tpchb' ).forEach( ( i ) => {
            i.checked = false
        } )
        document.querySelectorAll( 'input#nameInput' ).forEach( ( i ) => {
            i.value = ''
        } )
    }
    const nameCheck = async () => {
        if ( date == '' || name == '' || tp.length == 0 ) { alert( 'PLEASE CHOOSE DATE, TIME PERIODS AND ENTER YOUR NAME' ); return }
        var tpff = tp.filter( ( i ) => { return object?.Reservations?.[ date ]?.yellow?.includes( i ), object?.Reservations?.[ date ]?.red?.includes( i ) } )
        if ( tpff.length > 0 ) {
            await getObject( type, num, setObject )
            alert( 'Time was just Reserved, please rebook Your desired time' );
            clear()
        }
        else { changer( type, num, name, tp, date, 'yellow', setObject, getObject, clear, 0 ) }

    }
    return ( <>
        <div className='hicont'>
            <img src="/logoiw.png" alt='' className='headerimg' />
        </div>
        <h1 className='h1'>Unlock Your Potential </h1>
        <div className='options'>
            <h3 className='h3form'>Now Choose Your Desired Date & Time Then submit, You will then be redirected to payment page</h3>
            <input type='date' className='date1' name='date' id='date' onChange={ ( e ) => changeDate( e, setDate, clear ) } placeholder='Choose Date' />
            <form id='times'>
                <div className='timePeriods' >
                    {
                        timePeriods?.map( ( period ) => {
                            return (
                                <label className="container" key={ period }
                                    style={ {
                                        pointerEvents: cellCheck( object, period, date ),
                                        backgroundColor: 'whitesmoke'
                                    } }>
                                    { ' ' + period + ' ' }
                                    <input type="checkbox" className='tpchb' disabled={ date == '' ? true : false } onChange={ ( e ) => onCheck( e, tp, period, setTp ) }
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
            <input type='text' className='nameInput' id='nameInput' placeholder='Name In English' onChange={ ( e ) => changeName( e, setName ) } disabled={ disabled } />
            <button onClick={ nameCheck } className='submit' disabled={ disabled } >Submit</button>

        </div>
        <div className='invoice' style={ { display: show } }>
            { invoice }
            <button onClick={ () => setShow( 'none' ) }>Ok</button>
        </div>
    </>
    )
}
