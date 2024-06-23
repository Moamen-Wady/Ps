import { useEffect, useState } from 'react'
import "./styles.css"
import { Outlet } from 'react-router-dom'
import Categories from './Categories'
export default function Book( { notify, getResvs, dummy } ) {
    useEffect(
        () => {
            getResvs( '', '', setAll, 0, dummy, notify )
            notify( 'info', 'Free version, Loading may take a minute to finish on the first load' )
        }, [ getResvs, notify ] )
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
            <Categories all={ all } type={ type } typerr={ typerr } />
            <Outlet />

        </main >
    )
}
