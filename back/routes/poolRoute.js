const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Pool = require( '../models/poolSchema' );
router.route( '/pool' )

router.put( '/pool', async ( req, res ) => {
    var resv = req.body.resv;
    var number = req.body.number;
    await Pool.findOne( { Number: number } ).then(
        async ( pool ) => {
            console.log( pool )
            let poolResv = pool.Reservations
            await Pool.updateOne(
                { "Number": number },
                { $set: { Reservations: [ ...poolResv, resv ] } }
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