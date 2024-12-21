const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        gui: {
            type: mongoose.Schema.Types.ObjectId, // Liên kết đến User
            ref: 'User', // Tên model User
            required: true
        },
        nhan: {
            type: mongoose.Schema.Types.ObjectId, // Liên kết đến User
            ref: 'User', // Tên model User
            required: true
        },
        noi_dung: {
            type: String, // Nội dung tin nhắn
            required: true
        },
        trang_thai: {
            type: String, // Trạng thái tin nhắn: "sent", "delivered", "read"
            enum: ['gui', 'da gui', 'da doc'],
            default: 'gui'
        },
        type: {
            type: String, // Loại tin nhắn: "text", "image", "file"
            enum: ['chu', 'anh', 'file'],
            default: 'chu'
        },
        attachments: [
            {
                url: String, // URL file đính kèm
                fileType: String // Loại file (pdf, jpg, png, v.v.)
            }
        ]
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
