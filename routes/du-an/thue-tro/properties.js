const express = require('express');
const router = express.Router();
// SỬA LỖI: Đường dẫn đúng đến model
const Property = require('../../../models/property');

// Endpoint: Lấy tất cả phòng trọ (GET /api/properties)
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

// Endpoint: Lấy một phòng trọ theo ID (GET /api/properties/:id)
router.get('/:id', async (req, res) => {
    try {
        // Tìm theo trường 'id' mà bạn đã định nghĩa, không phải '_id' của MongoDB
        const property = await Property.findOne({ id: req.params.id });
        if (property == null) {
            return res.status(404).json({ message: 'Không tìm thấy phòng trọ' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

module.exports = router;