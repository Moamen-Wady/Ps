import React, { useRef, useState } from 'react'
import api from './api'

var timePeriods = [ "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30",
    "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00" ]


export default function Asset() {

    //API CALL
    async function book() {
        await api.put( `/${ type }`, {
            assetno: no,
            tp: tp,
            name: name,
            dateVal: dateVal
        } )
    }

    var [ tp, setTp ] = useState( [] )
    var dateVal = useRef()
    var name = useRef()


    function onCheck( e, item ) {
        if ( e.target.checked ) {
            e.target.checked = true;
            setTp( [ ...tp, item ] );
        }
        else {
            e.target.checked = false;
            setTp( tp.filter( ( currItem ) => currItem !== item ) );
        }
    };
    // //for preventing selection of reserved times
    // const checkEvents = ( reservations, period ) => {
    //     if ( !asset ) {
    //         return 'none'
    //     }
    //     if ( !reservations ) {
    //         return 'all'
    //     }
    //     else if ( reservations.includes( period ) ) {
    //         return 'none'
    //     }
    //     else { return 'all' }
    // }

    var href = window.location.href
    var sliced = href.split( '/book/' )
    var infoarr = sliced[ 1 ].split( '/' )

    var type = infoarr[ 0 ]
    var no = infoarr[ 1 ]

    return ( <>
        <div className='hicont'>
            <img src="/logoiw.png" className='headerimg' />
        </div>
        <h1 className='h1'>Unlock Your Potential </h1>
        <div className='options'>
            <input type='date' className='date1' name='date' id='date' ref={ dateVal } />
            <div className='timePeriods'>
                {
                    timePeriods.map( ( period ) => {
                        return (
                            <label className="container"  >
                                { ' ' + period + ' ' }
                                <input type="checkbox" onChange={ ( e ) => onCheck( e, period ) } style={ { pointerEvents: 'all' } } />
                                <span className="checkmark" ></span>
                            </label>
                        )
                    } )
                }
            </div>
            <input type='text' ref={ name } className='nameInput' placeholder=' Name In English' />
            <a onClick={ book } className='submit'>Submit</a>
        </div>
    </>
    )
}
