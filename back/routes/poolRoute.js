const Pool = require( '../models/poolSchema' );
const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
router.route( '/pool' )

router.put( '/pool/y', async ( req, res ) => {
    var date = req.body.date
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    var color = req.body.color
    var admin = req.body.admin
    await Pool.findOne( { num: num } ).then(
        async ( asset ) => {
            let assetResv = asset.Reservations
            if ( !assetResv[ date ] ) {
                await Pool.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...assetResv, [ date ]: { [ color ]: tp, names: [ name ], Resvs: [ { name: name, tp: tp, color: color } ] } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( !admin ) {
                    tp.map( ( i ) => {
                        if ( assetResv[ date ].yellow?.includes( i ) || assetResv[ date ].red?.includes( i ) ) {
                            throw new Error( 'tp' )
                        }
                    } )
                }
                else {
                    var prevnames = assetResv[ date ].names
                    var allnames
                    if ( prevnames.includes( name ) ) {
                        allnames = [ ...prevnames ]
                    }
                    else {
                        allnames = [ ...prevnames, name ]
                    }
                    var yellowtp = []
                    if ( assetResv[ date ][ color ] ) {
                        yellowtp = [ ...assetResv[ date ][ color ] ]
                    }
                    tp.forEach( element => {
                        yellowtp = [ ...yellowtp, element ]
                    } );
                    var redtp = []
                    if ( assetResv[ date ].red ) {
                        redtp = [ ...assetResv[ date ].red.filter( ( i ) => { return !tp.includes( i ) } ) ]
                    }
                    var allResvs
                    allResvs = [ ...assetResv[ date ].Resvs.filter( ( i ) => { return i.name !== name } ), { name: name, tp: tp, color: color } ]
                    await Pool.updateOne(
                        { "num": num },
                        { $set: { Reservations: { ...assetResv, [ date ]: { red: redtp, yellow: yellowtp, names: allnames, Resvs: allResvs } } } }
                    ).then(
                        res.send( { sts: 'ok' } )
                    ).catch(
                        ( err ) => { res.send( { sts: 'fail', err: err } ) }
                    )
                }
            }
        }
    ).catch(
        ( err ) => { res.send( { sts: 'fail', err: err.message } ) }
    )
} );

router.put( '/pool/r', async ( req, res ) => {
    var date = req.body.date
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    var color = req.body.color
    await Pool.findOne( { num: num } ).then(
        async ( asset ) => {
            let assetResv = asset.Reservations
            if ( !assetResv[ date ] ) {
                await Pool.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...assetResv, [ date ]: { [ color ]: tp, names: [ name ], Resvs: [ { name: name, tp: tp, color: color } ] } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
            }
            else {
                if ( !admin ) {
                    tp.map( ( i ) => {
                        if ( assetResv[ date ].yellow?.includes( i ) || assetResv[ date ].red?.includes( i ) ) {
                            throw new Error( 'tp' )
                        }
                    } )
                }
                else {
                    var prevnames = assetResv[ date ].names
                    var allnames
                    if ( prevnames.includes( name ) ) {
                        allnames = [ ...prevnames ]
                    }
                    else {
                        allnames = [ ...prevnames, name ]
                    }
                    var redtp = []
                    if ( assetResv[ date ][ color ] ) {
                        redtp = [ ...assetResv[ date ][ color ] ]
                    }
                    tp.forEach( element => {
                        redtp = [ ...redtp, element ]
                    } );
                    var yellowtp = []
                    if ( assetResv[ date ].yellow ) {
                        yellowtp = assetResv[ date ].yellow.filter( ( i ) => { return !tp.includes( i ) } )
                    }
                    var allResvs
                    allResvs = [ ...assetResv[ date ].Resvs.filter( ( i ) => { return i.name !== name } ), { name: name, tp: tp, color: color } ]
                    await Pool.updateOne(
                        { "num": num },
                        { $set: { Reservations: { ...assetResv, [ date ]: { yellow: yellowtp, red: redtp, names: allnames, Resvs: allResvs } } } }
                    ).then(
                        res.send( { sts: 'ok' } )
                    ).catch(
                        ( err ) => { res.send( { sts: 'fail', err: err.message } ) }
                    )
                }
            }
        }
    ).catch(
        ( err ) => { res.send( { sts: 'fail', err: err } ) }
    )
} );

router.put( '/pool/g', async ( req, res ) => {
    var date = req.body.date
    var tp = req.body.tp
    var name = req.body.name
    var num = req.body.num
    await Pool.findOne( { num: num } ).then(
        async ( asset ) => {
            let assetResv = asset.Reservations
            var unfilteredResvs = assetResv[ date ].Resvs
            var allResvs = unfilteredResvs?.filter( ( i ) => { return i.name !== name } )
            if ( allResvs.length == 0 || !allResvs ) {
                await Pool.updateOne(
                    { "num": num },
                    { $set: { Reservations: { ...assetResv, [ date ]: { red: [], yellow: [], names: [], Resvs: [] } } } }
                ).then(
                    res.send( { sts: 'ok' } )
                ).catch(
                    ( err ) => { res.send( { sts: 'fail', err: err } ) }
                )
                return
            }
            else {
                if ( !admin ) {
                    tp.map( ( i ) => {
                        if ( assetResv[ date ].yellow?.includes( i ) || assetResv[ date ].red?.includes( i ) ) {
                            throw new Error( 'tp' )
                        }
                    } )
                }
                else {
                    var prevnames = assetResv[ date ].names
                    var allnames = prevnames.filter( ( i ) => { return i !== name } )
                    var yellowtp = []
                    var redtp = []
                    if ( assetResv[ date ].yellow ) {
                        yellowtp = assetResv[ date ].yellow.filter( ( i ) => { return !tp.includes( i ) } )
                    }
                    if ( assetResv[ date ].red ) {
                        redtp = assetResv[ date ].red.filter( ( i ) => { return !tp.includes( i ) } )
                    }
                    await Pool.updateOne(
                        { "num": num },
                        { $set: { Reservations: { ...assetResv, [ date ]: { red: redtp, yellow: yellowtp, names: allnames, Resvs: allResvs } } } }
                    ).then(
                        res.send( { sts: 'ok' } )
                    ).catch(
                        ( err ) => { res.send( { sts: 'fail', err: err } ) }
                    )
                }
            }
        }
    ).catch(
        ( err ) => { res.send( { sts: 'fail', err: err.message } ) }
    )
} );

router.get( '/pool/:id', async ( req, res ) => {
    await Pool.findOne( { num: req.params.id } )
        .catch( ( err ) => {
            res.send( { sts: 'fail', err: err.message } )
        } ).then(
            ( object ) => {
                res.send( { sts: 'ok', object: object } )
            }
        )
} )


module.exports = router;