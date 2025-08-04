const mongoose = require('mongoose');
const Property = require('./models/property');
require('dotenv').config();

// SỬA LỖI: Thêm các biến phụ trợ bị thiếu
const genericAmenities = [
    { name: 'Camera an ninh', iconName: 'Camera' },
    { name: 'Cổng khóa vân tay', iconName: 'Lock' },
    { name: 'Hệ thống PCCC', iconName: 'Heater' },
    { name: 'Wifi', iconName: 'Wifi' },
    { name: 'Thang máy', iconName: 'Building' },
    { name: 'Sân phơi', iconName: 'Wind' },
    { name: 'Tủ lạnh', iconName: 'Refrigerator' },
    { name: 'Chỗ để xe', iconName: 'ParkingCircle' },
];

const gallerySet1 = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556702581-30c3c2423514?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617104679262-a24f2b414f5a?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594893761885-33a72665a57a?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628592268359-93a9c79e619b?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588796144874-6a0a09b30c17?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet2 = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593167933100-a8d465345b27?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet3 = [
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f458?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567016526105-6fec5a91a237?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631679703472-38890e0c5b55?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet4 = [
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ab16232e?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615875617265-38015feb6e1f?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503174971373-b1f69850b551?q=80&w=800&h=600&auto=format&fit=crop'
];

// Dưới đây là 16 ảnh mới trong 4 bộ sưu tập
const gallerySet5 = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571509594342-32d6959b5493?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9197a4a6a4?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet6 = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605346428642-ed0969b93114?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596381362454-45f43936254b?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet7 = [
    'https://images.unsplash.com/photo-1558941425-0d66a2f543a6?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576404838385-e42ea2137e15?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598558720491-79109012c8a0?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=800&h=600&auto=format&fit=crop'
];
const gallerySet8 = [
    'https://images.unsplash.com/photo-1533779283484-5ad490804409?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599696848692-73595878a156?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617806118233-14e558e94a03?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594498654829-05a86a815549?q=80&w=800&h=600&auto=format&fit=crop'
];


const genericRoomDetails = (prefix, basePrice) => [
    { id: `${prefix}-01`, size: '22 - 26 m²', capacity: 2, type: 'Phòng Studio', price: basePrice, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&h=300&auto=format&fit=crop' },
    { id: `${prefix}-02`, size: '25 - 28 m²', capacity: 2, type: 'Phòng Studio', price: basePrice + 150000, imageUrl: 'https://images.unsplash.com/photo-1560185893-a55de8537e49?q=80&w=400&h=300&auto=format&fit=crop' },
    { id: `${prefix}-03`, size: '20 - 24 m²', capacity: 2, type: 'Phòng Studio', price: basePrice - 100000, imageUrl: 'https://images.unsplash.com/photo-1556702581-30c3c2423514?q=80&w=400&h=300&auto=format&fit=crop' },
];

const propertiesToSeed = [
    {
        id: 'HN-01', title: 'CCMN Huyện Hoài Đức', city: 'Hà Nội', district: 'Huyện Hoài Đức', address: '18 ngõ 43 đường Trại Gà, xã Di Trạch', price: 4300000, priceRange: '4.150.000đ - 4.650.000đ', availableRooms: 12, imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Tòa nhà mới gần ĐH Công Nghiệp, full nội thất.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-01', 4300000)
    },
    {
        id: 'HN-02', title: 'CCMN Quận Nam Từ Liêm', city: 'Hà Nội', district: 'Quận Nam Từ Liêm', address: 'Số 12 ngõ 57 Trung Văn', price: 4000000, priceRange: '3.850.000đ - 4.150.000đ', availableRooms: 9, imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet2, description: 'Vị trí trung tâm, giao thông thuận tiện.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-02', 4000000)
    },
    {
        id: 'HN-03', title: 'CCMN Quận Bắc Từ Liêm', city: 'Hà Nội', district: 'Quận Bắc Từ Liêm', address: 'Số 40, ngách 38 ngõ 91 Cầu Diễn', price: 3800000, priceRange: '3.550.000đ - 4.050.000đ', availableRooms: 8, imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet3, description: 'Khu dân cư yên tĩnh, an ninh tốt.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-03', 3800000)
    },
    {
        id: 'HN-04', title: 'CCMN Quận Hà Đông', city: 'Hà Nội', district: 'Quận Hà Đông', address: 'Số 01, Ngõ 121 Ngô Thì Sỹ', price: 2800000, priceRange: '2.500.000đ - 3.000.000đ', availableRooms: 8, imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet4, description: 'Giá cả hợp lý, phù hợp sinh viên.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-04', 2800000)
    },
    {
        id: 'HN-05', title: 'CCMN Quận Cầu Giấy', city: 'Hà Nội', district: 'Quận Cầu Giấy', address: 'Số 36, ngõ 191, Phạm Văn Đồng', price: 6000000, priceRange: '5.550.000đ - 6.550.000đ', availableRooms: 7, imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet5, description: 'Gần các trường đại học lớn, tiện ích đầy đủ.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-05', 6000000)
    },
    {
        id: 'HN-06', title: 'CCMN Quận Thanh Xuân', city: 'Hà Nội', district: 'Quận Thanh Xuân', address: '44B ngõ 111 Nguyễn Xiển', price: 7600000, priceRange: '7.250.000đ - 7.850.000đ', availableRooms: 7, imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet6, description: 'Căn hộ cao cấp, nội thất hiện đại.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-06', 7600000)
    },
    {
        id: 'HN-07', title: 'CCMN Quận Ba Đình', city: 'Hà Nội', district: 'Quận Ba Đình', address: '55 Đội Cấn, Ba Đình', price: 8500000, priceRange: 'Trên 7 triệu', availableRooms: 3, imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce0687954?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet7, description: 'Vị trí trung tâm quận Ba Đình, gần Lăng Bác.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-07', 8500000)
    },
    {
        id: 'HN-08', title: 'CCMN Quận Tây Hồ', city: 'Hà Nội', district: 'Quận Tây Hồ', address: '125 Trích Sài, Tây Hồ', price: 9500000, priceRange: 'Trên 7 triệu', availableRooms: 5, imageUrl: 'https://images.unsplash.com/photo-1571055152203-e221375434e0?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet8, description: 'View Hồ Tây thoáng đãng, không khí trong lành.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-08', 9500000)
    },
    {
        id: 'HN-09', title: 'CCMN Quận Đống Đa', city: 'Hà Nội', district: 'Quận Đống Đa', address: '218 Láng, Đống Đa', price: 4800000, priceRange: '3 - 5 triệu', availableRooms: 10, imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f458?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Gần Ngã Tư Sở, thuận tiện đi lại.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-09', 4800000)
    },
    {
        id: 'HN-10', title: 'CCMN Quận Hai Bà Trưng', city: 'Hà Nội', district: 'Quận Hai Bà Trưng', address: '99 Minh Khai, Hai Bà Trưng', price: 5200000, priceRange: '5 - 7 triệu', availableRooms: 6, imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631f3e7?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet2, description: 'Gần Times City, nhiều tiện ích xung quanh.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HN-10', 5200000)
    },
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `HN-${11 + i}`, title: `CCMN Mẫu Hà Nội ${11 + i}`, city: 'Hà Nội', district: ['Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Ba Đình'][i % 3], address: `Địa chỉ mẫu ${11 + i}, Hà Nội`, price: 2500000 + i * 500000, priceRange: 'Dưới 3 triệu', availableRooms: 5 + i, imageUrl: `https://images.unsplash.com/photo-1594563703937-fdc640497dcd?q=80&w=400&h=300&auto=format&fit=crop&ixid=${i}`,
        gallery: gallerySet3, description: `Mô tả mẫu cho căn hộ ${11 + i}`, amenities: genericAmenities, availableRoomDetails: genericRoomDetails(`HN-${11 + i}`, 2500000 + i * 500000)
    })),

    // TP. Hồ Chí Minh (20)
    {
        id: 'HCM-01', title: 'Căn hộ Quận 1', city: 'TP. Hồ Chí Minh', district: 'Quận 1', address: '123 Nguyễn Huệ, Phường Bến Nghé', price: 8000000, priceRange: 'Trên 7 triệu', availableRooms: 5, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet4, description: 'Căn hộ sang trọng ngay trung tâm Sài Gòn.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-01', 8000000)
    },
    {
        id: 'HCM-02', title: 'Căn hộ Quận 7', city: 'TP. Hồ Chí Minh', district: 'Quận 7', address: '456 Nguyễn Thị Thập, Phường Tân Phong', price: 6800000, priceRange: '5 - 7 triệu', availableRooms: 10, imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet5, description: 'Khu đô thị hiện đại, gần Crescent Mall.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-02', 6800000)
    },
    {
        id: 'HCM-03', title: 'Căn hộ TP. Thủ Đức', city: 'TP. Hồ Chí Minh', district: 'TP. Thủ Đức', address: '789 Võ Văn Ngân, Phường Linh Chiểu', price: 4800000, priceRange: '3 - 5 triệu', availableRooms: 15, imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet6, description: 'Làng đại học, phù hợp cho sinh viên.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-03', 4800000)
    },
    {
        id: 'HCM-04', title: 'Căn hộ Quận Bình Thạnh', city: 'TP. Hồ Chí Minh', district: 'Quận Bình Thạnh', address: '101 Xô Viết Nghệ Tĩnh, Phường 21', price: 2500000, priceRange: 'Dưới 3 triệu', availableRooms: 6, imageUrl: 'https://images.unsplash.com/photo-1567016432779-1fee749b5315?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet7, description: 'Gần các trường đại học, giá tốt.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-04', 2500000)
    },
    {
        id: 'HCM-05', title: 'Căn hộ Quận 3', city: 'TP. Hồ Chí Minh', district: 'Quận 3', address: '227 Nguyễn Đình Chiểu, Phường 5', price: 9000000, priceRange: 'Trên 7 triệu', availableRooms: 4, imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet8, description: 'Trung tâm thành phố, tiện nghi cao cấp.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-05', 9000000)
    },
    {
        id: 'HCM-06', title: 'Căn hộ Quận Gò Vấp', city: 'TP. Hồ Chí Minh', district: 'Quận Gò Vấp', address: '333 Quang Trung, Phường 10', price: 4500000, priceRange: '3 - 5 triệu', availableRooms: 11, imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Khu vực sầm uất, gần sân bay.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('HCM-06', 4500000)
    },
    ...Array.from({ length: 14 }, (_, i) => ({
        id: `HCM-${7 + i}`, title: `Căn hộ Mẫu HCM ${7 + i}`, city: 'TP. Hồ Chí Minh', district: ['Quận 10', 'Quận Tân Bình', 'Quận Phú Nhuận'][i % 3], address: `Địa chỉ mẫu ${7 + i}, HCM`, price: 3000000 + i * 400000, priceRange: '3 - 5 triệu', availableRooms: 3 + i, imageUrl: `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&h=300&auto=format&fit=crop&ixid=${i}`,
        gallery: gallerySet1, description: `Mô tả mẫu cho căn hộ ${7 + i}`, amenities: genericAmenities, availableRoomDetails: genericRoomDetails(`HCM-${7 + i}`, 3000000 + i * 400000)
    })),

    // Đà Nẵng (10)
    {
        id: 'DN-01', title: 'Chung cư Quận Hải Châu', city: 'Đà Nẵng', district: 'Quận Hải Châu', address: '23 Bạch Đằng, Phường Thạch Thang', price: 6500000, priceRange: '5 - 7 triệu', availableRooms: 8, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'View sông Hàn, trung tâm thành phố.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('DN-01', 6500000)
    },
    {
        id: 'DN-02', title: 'Căn hộ Quận Sơn Trà', city: 'Đà Nẵng', district: 'Quận Sơn Trà', address: '55 Võ Nguyên Giáp, Phường Phước Mỹ', price: 7500000, priceRange: 'Trên 7 triệu', availableRooms: 4, imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Gần biển Mỹ Khê, khu du lịch.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('DN-02', 7500000)
    },
    {
        id: 'DN-03', title: 'Căn hộ Quận Ngũ Hành Sơn', city: 'Đà Nẵng', district: 'Quận Ngũ Hành Sơn', address: '88 An Thượng 30', price: 5500000, priceRange: '5 - 7 triệu', availableRooms: 9, imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Khu phố Tây, gần nhiều nhà hàng, quán bar.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('DN-03', 5500000)
    },
    {
        id: 'DN-04', title: 'Căn hộ Quận Thanh Khê', city: 'Đà Nẵng', district: 'Quận Thanh Khê', address: '111 Nguyễn Văn Linh', price: 4200000, priceRange: '3 - 5 triệu', availableRooms: 12, imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=400&h=300&auto=format&fit=crop',
        gallery: gallerySet1, description: 'Trung tâm quận Thanh Khê, tiện ích đầy đủ.', amenities: genericAmenities, availableRoomDetails: genericRoomDetails('DN-04', 4200000)
    },
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `DN-${5 + i}`, title: `Căn hộ Mẫu Đà Nẵng ${5 + i}`, city: 'Đà Nẵng', district: ['Quận Liên Chiểu', 'Quận Cẩm Lệ'][i % 2], address: `Địa chỉ mẫu ${5 + i}, Đà Nẵng`, price: 2200000 + i * 300000, priceRange: 'Dưới 3 triệu', availableRooms: 7 + i, imageUrl: `https://images.unsplash.com/photo-1600585152225-3579fe9d7ae9?q=80&w=400&h=300&auto=format&fit=crop&ixid=${i}`,
        gallery: gallerySet1, description: `Mô tả mẫu cho căn hộ ${5 + i}`, amenities: genericAmenities, availableRoomDetails: genericRoomDetails(`DN-${5 + i}`, 2200000 + i * 300000)
    })),
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Đã kết nối đến MongoDB để nạp dữ liệu...');

        await Property.deleteMany({});
        console.log('Đã xóa dữ liệu cũ.');

        await Property.insertMany(propertiesToSeed);
        console.log('Đã nạp dữ liệu mới thành công!');

    } catch (error) {
        console.error('Lỗi khi nạp dữ liệu:', error);
    } finally {
        mongoose.connection.close();
        console.log('Đã đóng kết nối.');
    }
}

seedDB();