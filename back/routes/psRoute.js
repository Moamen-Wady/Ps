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
        async ( asset ) => {
            let assetResv = asset.Reservations
            if ( !assetResv[ dateVal ] ) {
                await Ps.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...assetResv, [ dateVal ]: { tp: tp, names: [ [ name ] ], Resvs: [ { name: name, tp: tp } ] } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( assetResv[ dateVal ].hasOwnProperty( 'tp' ) && assetResv[ dateVal ].tp.includes( tp ) ) { res.send( { sts: 'fail', err: 'tp' } ) }
                if ( assetResv[ dateVal ].hasOwnProperty( 'names' ) && assetResv[ dateVal ].names.includes( name ) ) { res.send( { sts: 'fail', err: 'name' } ) }
                var prevnames = assetResv[ dateVal ].names
                var allnames = [ ...prevnames, [ name ] ]
                var newtp = [ ...assetResv[ dateVal ].tp ]
                tp.forEach( element => {
                    newtp = [ ...newtp, element ]
                } );
                var allResvs = [ ...assetResv[ dateVal ].Resvs, { name: name, tp: tp } ]
                await Ps.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...assetResv, [ dateVal ]: { tp: newtp, names: allnames, Resvs: allResvs } } } }
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