const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho các tiện nghi con
const AmenitySchema = new Schema({
    name: { type: String, required: true },
    iconName: { type: String, required: true },
}, { _id: false });

// Schema cho các phòng trống con
const RoomSchema = new Schema({
    id: { type: String, required: true },
    size: String,
    capacity: Number,
    type: String,
    price: Number,
    imageUrl: String,
}, { _id: false });

// Schema chính cho một bất động sản
const PropertySchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: String,
    price: { type: Number, required: true },
    priceRange: String,
    availableRooms: Number,
    imageUrl: String,
    gallery: [String],
    description: String,
    amenities: [AmenitySchema],
    availableRoomDetails: [RoomSchema],
});

module.exports = mongoose.model('Property', PropertySchema);
