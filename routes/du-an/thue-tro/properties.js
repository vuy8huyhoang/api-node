const express = require('express');
const router = express.Router();
// Thêm thư viện compression để nén response body
const compression = require('compression');
const Property = require('../../../models/property');

// Sử dụng middleware compression cho tất cả các route trong file này
// Giúp giảm kích thước response JSON, tăng tốc độ tải về phía client
router.use(compression());

// Endpoint: Lấy tất cả phòng trọ (tối ưu hóa với phân trang và chọn lọc trường)
// GET /api/properties?page=1&limit=10
router.get('/', async (req, res) => {
    // Lấy tham số page và limit từ query string, có giá trị mặc định
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        // Thực thi 2 câu lệnh bất đồng bộ song song để tiết kiệm thời gian
        const [properties, totalDocuments] = await Promise.all([
            Property.find({}) // Có thể thêm điều kiện lọc vào đây nếu cần
                .select('id title address price image') // 1. CHỌN LỌC: Chỉ lấy các trường cần thiết cho danh sách
                .skip(skip)   // 2. PHÂN TRANG: Bỏ qua các bản ghi của trang trước
                .limit(limit) // 3. PHÂN TRANG: Giới hạn số lượng bản ghi trả về
                .lean(),      // 4. LEAN: Trả về POJO thay vì Mongoose Document, nhanh hơn đáng kể
            Property.countDocuments({}) // Đếm tổng số lượng để tính toán phân trang
        ]);

        res.json({
            data: properties,
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit),
            totalItems: totalDocuments
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

// Endpoint: Lấy một phòng trọ theo ID (tối ưu hóa với lean)
// GET /api/properties/:id
router.get('/:id', async (req, res) => {
    // QUAN TRỌNG: Đảm bảo bạn đã tạo index cho trường 'id' trong model Property
    // Nếu không, Mongoose sẽ phải quét toàn bộ collection, rất chậm.
    // Trong file model/property.js, hãy định nghĩa schema như sau:
    // const propertySchema = new mongoose.Schema({
    //   id: { type: String, required: true, unique: true, index: true }, // Thêm index: true
    //   ...các trường khác
    // });

    try {
        const property = await Property.findOne({ id: req.params.id })
            .lean(); // LEAN: Tối ưu cho các tác vụ chỉ đọc

        if (!property) {
            return res.status(404).json({ message: 'Không tìm thấy phòng trọ' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message });
    }
});

module.exports = router;