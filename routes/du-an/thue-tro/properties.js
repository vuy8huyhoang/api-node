const express = require('express');
const router = express.Router();
// Đường dẫn đúng đến model
const Property = require('../../../models/property');

/**
 * Endpoint: Lấy tất cả phòng trọ với phân trang (GET /api/properties)
 * Tối ưu hóa bằng cách thêm phân trang, .select() và .lean()
 * * Query params:
 * - page: Trang hiện tại (mặc định: 1)
 * - limit: Số lượng kết quả mỗi trang (mặc định: 10)
 * * Ví dụ: /api/properties?page=2&limit=20
 */
router.get('/', async (req, res) => {
    // Lấy page và limit từ query string, đặt giá trị mặc định
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        // Chỉ chọn các trường cần thiết cho danh sách hiển thị
        const properties = await Property.find()
            .select('id title address price area') // Tối ưu 1: Chỉ lấy các trường cần thiết
            .skip(skip)                          // Tối ưu 2: Bỏ qua các bản ghi của trang trước
            .limit(limit)                        // Tối ưu 2: Giới hạn số lượng bản ghi trả về
            .lean();                             // Tối ưu 3: Trả về POJO cho hiệu năng cao hơn

        // Lấy tổng số lượng bản ghi để tính tổng số trang
        const totalProperties = await Property.countDocuments();

        res.json({
            totalPages: Math.ceil(totalProperties / limit),
            currentPage: page,
            properties
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

/**
 * Endpoint: Lấy một phòng trọ theo ID (GET /api/properties/:id)
 * Tối ưu hóa bằng cách thêm .lean() và quan trọng nhất là ĐÁNH INDEX cho trường 'id'
 */
router.get('/:id', async (req, res) => {
    try {
        // Tối ưu: Sử dụng .lean() để tăng tốc độ truy vấn
        const property = await Property.findOne({ id: req.params.id }).lean();

        if (property == null) {
            return res.status(404).json({ message: 'Không tìm thấy phòng trọ' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

module.exports = router;