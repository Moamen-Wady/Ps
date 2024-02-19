const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Ping = require( '../models/pingSchema' );
router.route( '/ping' )

router.put( '/ping', async ( req, res ) => {
    var resv = req.body.resv;
    var number = req.body.number;
    await Ping.findOne( { Number: number } ).then(
        async ( ping ) => {
            console.log( ping )
            let pingResv = ping.Reservations
            await Ping.updateOne(
                { "Number": number },
                { $set: { Reservations: [ ...pingResv, resv ] } }
            )

        }
    )
    // await ( Seat.bulkWrite( bulkArr, { ordered: true } ) )
    //     .then( () => res.send( {
    //         status: 'ok'
    //     } ) )
    //     .catch( ( err ) => {
    //         res.send( {
    //             status: 'fail',
    //             result: err.message
    //         } )
    //     } )
} );

module.exports = router;