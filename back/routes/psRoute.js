const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Ps = require( '../models/psSchema' );
router.route( '/ps' )

router.put( '/ps', async ( req, res ) => {
    var dateVal = req.body.dateVal
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    await Ps.findOne( { num: num } ).then(
        async ( ps ) => {
            let psResv = ps.Reservations
            if ( !psResv[ dateVal ] ) {
                await Ps.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...psResv, [ dateVal ]: { tp: tp, names: { [ name ]: tp } } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( psResv[ dateVal ].hasOwnProperty( 'tp' ) && psResv[ dateVal ].tp.includes( tp ) ) { res.send( { sts: 'fail', err: 'tp' } ) }
                if ( psResv[ dateVal ].hasOwnProperty( 'names' ) && psResv[ dateVal ].names.hasOwnProperty( name ) ) { res.send( { sts: 'fail', err: 'name' } ) }
                var prevnames = psResv[ dateVal ].names
                var allnames = { ...prevnames, ...{ [ name ]: tp } }
                var newtp = [ ...psResv[ dateVal ].tp ]
                tp.forEach( element => {
                    newtp = [ ...newtp, element ]
                } );
                await Ps.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...psResv, [ dateVal ]: { tp: newtp, names: allnames } } } }
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

router.get( '/ps/:id', async ( req, res ) => {
    await Ps.findOne( { num: req.params.id } )
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