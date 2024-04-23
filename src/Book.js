import React, { useEffect, useState } from 'react'
import "./styles.css"
import { Link, Outlet } from 'react-router-dom'
import api from './api'
export default function Book() {
    async function getAll() {
        await api.get( `/getall` )
            .then(
                ( data ) => {
                    if ( data.data.sts !== 'ok' ) { alert( 'network error' ) }
                    else { setAll( data.data.all ); }
                } )
            .catch( () => { alert( 'network error' ) } )
    }
    useEffect(
        () => { getAll() }
        , [] )
    var [ all, setAll ] = useState( [] )
    var [ type, setType ] = useState( 'ps' )
    const typerr = ( e ) => {
        setType( e.target.slot )
    }
    return (
        <main>
            <h1>Welcome, Gamer...</h1>
            <h1><i className='rnb'>Are</i> <i className='rnb'>You</i> <i className='rnb'>Ready</i>?</h1>
            <h3 className='h3'>Choose Your Desired Game & Room</h3>
            <div className='fulltablecont'>
                <div className='tabs'>
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
                <div className='assets'>
                    { all[ type ]?.sort( ( a, b ) => a.num - b.num ).map( ( item ) => {
                        return (
                            <Link to={ '/book/' + type + '/' + item.num } className='asset' key={ item.num }>
                                <div key={ type.toString() + ' no. ' + item.num } >
                                    <h4 className='h4'>{ type.toString() + ' no. ' + item.num }</h4>
                                    <img className='assetimg' src='pst.jpg' alt='' />
                                </div>
                            </Link>
                        )
                    } ) }
                </div>
                <Outlet />
            </div>
        </main >
    )
}
