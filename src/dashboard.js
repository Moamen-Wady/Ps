import React, { useEffect, useState } from 'react'
import api from './api'
import "./styles.css"
var timePeriods = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30"
]

export default function Dashboard() {
    const getResvs = async () => {
        await api.get( '/getall' ).then( ( data ) => {
            if ( data.data.sts !== 'ok' ) { alert( 'network error' ); return }
            else { setall( data.data.all ) }
        } ).catch( ( err ) => alert( err ) )
    }
    var [ date, setDate ] = useState( '' )
    var [ all, setall ] = useState( '' )
    var [ object, setObject ] = useState(
        {
            Reservations: {},
            num: 0
        }
    )

    const changeDate = ( e ) => {
        setDate( e.target.value )
    }
    useEffect( () => {
        getResvs()
    }, [ date ] )

    const cellColor = ( period ) => {
        if ( !object ) { return 'red' }
        else if ( !object.Reservations ) { return 'limegreen' }
        else if ( !object.Reservations[ date ] ) { return 'limegreen' }
        else if ( object.Reservations[ date ].hasOwnProperty( 'tp' ) == false ) { return 'limegreen' }
        else if ( object.Reservations[ date ].tp.includes( period ) ) { return 'red' }
        else { return 'limegreen' }
    }
    const cellCheck = ( period ) => {
        if ( !object ) { return 'none' }
        else if ( !object.Reservations ) { return 'all' }
        else if ( !object.Reservations[ date ] ) { return 'all' }
        else if ( object.Reservations[ date ].hasOwnProperty( 'tp' ) == false ) { return 'all' }
        else if ( object.Reservations[ date ].tp.includes( period ) ) { return 'none' }
        else { return 'all' }
    }
    var [ type, setType ] = useState( 'ps' )
    const typerr = ( e ) => {
        setType( e.target.slot )
    }
    const Objecter = ( e ) => {
        setObject( e )
    }
    console.log( object )
    return (
        <>
            <div className='fulltablecont'>
                <div className='tabs' style={ { position: 'static' } }>
                    <div className='tab' onClick={ typerr } slot='ps'
                        style={ type == 'ps' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='ps'>play station</h2></div>
                    <div className='tab' onClick={ typerr } slot='pool'
                        style={ type == 'pool' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='pool'>pool</h2></div>
                    <div className='tab' onClick={ typerr } slot='ping'
                        style={ type == 'ping' ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                        <h2 className='h2' slot='ping'>ping pong</h2></div>
                </div>
                <div className='fulltablecont'>
                    <div className='tabs'>
                        { all[ type ]?.map( ( item ) => {
                            return (
                                <button className='tab' key={ item.num } onClick={ () => Objecter( item ) }
                                    style={ object == item ? { backgroundColor: 'rgb(0, 255, 13)' } : {} }>
                                    <h2 className='h2'>{ type.toString() + ' no. ' + item.num }</h2>
                                </button>
                            )
                        } ) }
                    </div>
                </div>
            </div>
            <div className="options">
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Reservations</th>
                        <th>Options</th>
                    </thead>
                    <tbody>
                        {
                            object.Reservations[ date ]?.Resvs.map(
                                ( i ) => {
                                    return (
                                        <>
                                            <td>{ i.name }</td>
                                            <td>{ i.tp }</td>
                                            <td>
                                                <button className='submit'>Confirm</button><br />
                                                <button className='submit'>Cancel</button>
                                            </td>

                                        </>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                <input type='date' className='date1' name='date' id='date' onChange={ changeDate } placeholder='Choose Date' />
                <form id='times'>
                    <div className='timePeriods' >
                        {
                            timePeriods.map( ( period ) => {
                                return (
                                    <label className="container" key={ period }
                                        style={ {
                                            pointerEvents: cellCheck( period ),
                                            backgroundColor: 'whitesmoke'
                                        } }>
                                        { ' ' + period + ' ' }
                                        <input type="checkbox" disabled={ date == '' ? true : false }
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
            </div>
        </>
    )
}
