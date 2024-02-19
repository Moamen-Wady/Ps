const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Ping = require( '../models/pingSchema' );
const Pool = require( '../models/poolSchema' );
const Ps = require( '../models/psSchema' );

router.route( '/getall' )

router.get( '/getall', async ( req, res ) => {
    let pingT = await Ping.find()
        .catch( ( err ) => {
            console.log( err );
            res.send( { sts: 'fail' } )
        } )
    let psT = await Ps.find()
        .catch( ( err ) => {
            console.log( err );
            res.send( { sts: 'fail' } )
        } )
    let poolT = await Pool.find()
        .catch( ( err ) => {
            console.log( err );
            res.send( { sts: 'fail' } )
        } )
    let all = {
        pool: poolT,
        ps: psT,
        ping: pingT
    }
    res.send( { sts: 'ok', all: all } )
} )
//reset all

module.exports = router