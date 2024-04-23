import React, { useState, useEffect } from 'react'
import api from './api'

var timePeriods = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30"
]
export default function Asset() {
    //API CALLS
    async function getObject( type, num ) {
        await api.get( `/${ type }/${ num }` )
            .then(
                ( data ) => {
                    if ( data.data.sts !== 'ok' ) { alert( 'network error' ) }
                    else { setObject( data.data.object ) }
                } )
            .catch( () => { alert( 'network error' ) } )
    }
    async function book() {
        if ( date == '' ) return;
        await api.put( `/${ type }/y`, {
            num: num,
            tp: tp,
            name: name,
            color: 'yellow',
            date: date
        } ).then( ( data ) => {
            if ( data.data.sts == 'ok' ) {
                alert( 'saved' ); setTimeout( () => {
                    window.location.reload()
                }, 200 );
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
    const invoicer = ( p ) => {
        setInvoice( p )
        setShow( 'block' )
    }
    var [ object, setObject ] = useState( {} )
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
            getObject( type, num )
        }, [ type, num ]
    )

    const changeName = ( e ) => {
        setName( e.target.value )
    }
    const changeDate = ( e ) => {
        setDate( e.target.value )
        document.getElementById( 'times' ).reset()
        document.getElementById( 'nameInput' ).value = ''
        setTp( [] )
    }
    function onCheck( e, item ) {
        if ( e.target.checked ) {
            e.target.checked = true
            setTp( [ ...tp, item ] )
        }
        else {
            e.target.checked = false
            setTp( tp.filter( ( currItem ) => currItem !== item ) )
        }
    }
    const cellColor = ( period ) => {
        if ( object?.Reservations?.[ date ]?.yellow?.includes( period ) ) { return 'yellow' }
        else if ( object?.Reservations?.[ date ]?.red?.includes( period ) ) { return 'red' }
        else { return 'limegreen' }
    }
    const cellCheck = ( period ) => {
        if ( object?.Reservations?.[ date ]?.yellow?.includes( period ) ) { return 'none' }
        else if ( object?.Reservations?.[ date ]?.red?.includes( period ) ) { return 'none' }
        else { return 'all' }
    }
    const nameCheck = () => {
        if ( date == '' || name == '' || tp.length == 0 ) { alert( 'PLEASE CHOOSE DATE, TIME PERIODS AND ENTER YOUR NAME' ); return }
        else if ( object?.Reservations?.[ date ]?.names?.includes( name ) ) { alert( 'Name Already used this day, enter another name' ); return }
        else { book() }
    }
    return ( <>
        <div className='hicont'>
            <img src="/logoiw.png" alt='' className='headerimg' />
        </div>
        <h1 className='h1'>Unlock Your Potential </h1>
        <div className='options'>
            <h3 className='h3form'>Now Choose Your Desired Date & Time Then submit, You will then be redirected to payment page</h3>
            <input type='date' className='date1' name='date' id='date' onChange={ changeDate } placeholder='Choose Date' />
            <form id='times'>
                <div className='timePeriods' >
                    {
                        timePeriods?.map( ( period ) => {
                            return (
                                <label className="container" key={ period }
                                    style={ {
                                        pointerEvents: cellCheck( period ),
                                        backgroundColor: 'whitesmoke'
                                    } }>
                                    { ' ' + period + ' ' }
                                    <input type="checkbox" disabled={ date == '' ? true : false } onChange={ ( e ) => onCheck( e, period ) }
                                        style={ {
                                            pointerEvents: cellCheck( period ),
                                            backgroundColor: cellColor( period )
                                        } } />
                                    <span className="checkmark"
                                        style={ {
                                            pointerEvents: cellCheck( period ),
                                            backgroundColor: cellColor( period )
                                        } }
                                    ></span>
                                </label>
                            )
                        } )
                    }
                </div>
            </form>
            <input type='text' className='nameInput' id='nameInput' placeholder='Name In English' onChange={ changeName } disabled={ disabled } />
            <button onClick={ nameCheck } className='submit' disabled={ disabled } >Submit</button>

        </div>
        <div className='invoice' style={ { display: show } }>
            { invoice }
            <button onClick={ () => setShow( 'none' ) }>Ok</button>
        </div>
    </>
    )
}
