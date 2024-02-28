const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Ping = require( '../models/pingSchema' );
router.route( '/ping' )

router.put( '/ping', async ( req, res ) => {
    var dateVal = req.body.dateVal
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    await Ping.findOne( { num: num } ).then(
        async ( ping ) => {
            let pingResv = ping.Reservations
            if ( !pingResv[ dateVal ] ) {
                await Ping.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...pingResv, [ dateVal ]: { tp: tp, names: { [ name ]: tp } } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( pingResv[ dateVal ].hasOwnProperty( 'tp' ) && pingResv[ dateVal ].tp.includes( tp ) ) { res.send( { sts: 'fail', err: 'tp' } ) }
                if ( pingResv[ dateVal ].hasOwnProperty( 'names' ) && pingResv[ dateVal ].names.hasOwnProperty( name ) ) { res.send( { sts: 'fail', err: 'name' } ) }
                var prevnames = pingResv[ dateVal ].names
                var allnames = { ...prevnames, ...{ [ name ]: tp } }
                var newtp = [ ...pingResv[ dateVal ].tp ]
                tp.forEach( element => {
                    newtp = [ ...newtp, element ]
                } );
                await Ping.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...pingResv, [ dateVal ]: { tp: newtp, names: allnames } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
        }
    ).catch(
        ( err ) => { res.send( { sts: 'fail', err: err } ) }
    )
} );

router.get( '/ping/:id', async ( req, res ) => {
    await Ping.findOne( { num: req.params.id } )
        .catch( ( err ) => {
            console.log( err );
            res.send( { sts: 'fail' } )
        } ).then(
            ( object ) => {
                console.log( object )
                res.send( { sts: 'ok', object: object } )
            }
        )
} )

module.exports = router;