const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const Ps = require( '../models/psSchema' );
router.route( '/ps' )

router.put( '/ps', async ( req, res ) => {
    var assetno = req.body.assetno
    var tp = req.body.tp
    var name = req.body.name
    var dateVal = req.body.dateVal
    await Ps.findOne( { Number: assetno } ).then(
        async ( ps ) => {
            console.log( ps )
            let psResv = ps.Reservations
            await Ps.updateOne(
                { "Number": number },
                { $set: { Reservations: [ ...psResv, resv ] } }
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