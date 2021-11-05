var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref:'users'},
    ordersId : [{type : mongoose.Schema.Types.ObjectId, ref:'journeys'}]
});

var ordersModel = mongoose.model('orders',orderSchema);

module.exports = ordersModel