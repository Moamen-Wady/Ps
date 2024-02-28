const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Pool = require( '../models/poolSchema' );
router.route( '/pool' )

router.put( '/pool', async ( req, res ) => {
    var dateVal = req.body.dateVal
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    await Pool.findOne( { num: num } ).then(
        async ( pool ) => {
            let poolResv = pool.Reservations
            if ( !poolResv[ dateVal ] ) {
                await Pool.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...poolResv, [ dateVal ]: { tp: tp, names: { [ name ]: tp } } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( poolResv[ dateVal ].hasOwnProperty( 'tp' ) && poolResv[ dateVal ].tp.includes( tp ) ) { res.send( { sts: 'fail', err: 'tp' } ) }
                if ( poolResv[ dateVal ].hasOwnProperty( 'names' ) && poolResv[ dateVal ].names.hasOwnProperty( name ) ) { res.send( { sts: 'fail', err: 'name' } ) }
                var prevnames = poolResv[ dateVal ].names
                var allnames = { ...prevnames, ...{ [ name ]: tp } }
                var newtp = [ ...poolResv[ dateVal ].tp ]
                tp.forEach( element => {
                    newtp = [ ...newtp, element ]
                } );
                await Pool.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...poolResv, [ dateVal ]: { tp: newtp, names: allnames } } } }
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


router.get( '/pool/:id', async ( req, res ) => {
    await Pool.findOne( { num: req.params.id } )
        .catch( ( err ) => {
            console.log( err );
            res.send( { sts: 'fail' } )
        } ).then(
            ( object ) => {
                var resv = object.Reservations
                console.log( resv )
                res.send( { sts: 'ok', object: object } )
            }
        )
} )


module.exports = router;