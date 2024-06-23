import React from 'react'
import { Link } from 'react-router-dom'

export default function Categories( { type, all, typerr } ) {
    return (
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
        </div>
    )
}
