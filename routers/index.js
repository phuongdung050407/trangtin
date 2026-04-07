var express = require('express');
var router = express.Router();
var firstImage = require('../modules/firstimage');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Trang chủ
router.get('/', async (req, res) => {
	var cm = await ChuDe.find();

	var bv = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(12).exec();

	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('index', {
		title: 'Trang chủ',
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Lấy các bài viết cùng mã chủ đề
router.get('/baiviet/chude/:id', async (req, res) => {
	var id = req.params.id;

	var cm = await ChuDe.find();

	var cd = await ChuDe.findById(id);

	var bv = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(8).exec();

	var xnn = await BaiViet.find({ KiemDuyet: 1, ChuDe: id })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('baiviet_chude', {
		title: 'Bài viết cùng chuyên mục',
		chuyenmuc: cm,
		chude: cd,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async (req, res) => {
	var id = req.params.id;

	var cm = await ChuDe.find();

	var bv = await BaiViet.findById(id)
		.populate('ChuDe')
		.populate('TaiKhoan').exec();

	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('baiviet_chitiet', {
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Tin mới nhất
router.get('/tinmoi', async (req, res) => {
	res.render('tinmoinhat', {
		title: 'Tin mới nhất'
	});
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', async (req, res) => {
	var tukhoa = req.body.tukhoa;

	// 2. Lấy danh sách chuyên mục (để hiển thị trong dropdown menu và sidebar "Thẻ")
	var cm = await ChuDe.find();

	// 3. Tìm kiếm bài viết dựa trên tiêu đề (TieuDe) hoặc tóm tắt (nếu có)
	// Sử dụng RegExp với tùy chọn 'i' để không phân biệt chữ hoa/thường
	var bv = await BaiViet.find({
		KiemDuyet: 1, TieuDe: { $regex: new RegExp(tukhoa, "i") }
	})
		.sort({ NgayDang: -1 }) // Bài mới nhất lên đầu
		.populate('ChuDe')
		.populate('TaiKhoan')
		.exec();

	// 4. Lấy danh sách bài viết xem nhiều nhất (để hiển thị ở sidebar bên phải)
	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.limit(3) // Lấy 3 bài như trong file ejs
		.exec();

	// 5. Render file 'timkiem' và truyền tất cả các biến cần thiết
	res.render('timkiem', {
		title: 'Kết quả tìm kiếm',
		chuyenmuc: cm,      // Đổ vào menu Chuyên mục và phần Thẻ
		baiviet: bv,        // Đổ vào danh sách bài viết chính (giữa trang)
		xemnhieunhat: xnn,  // Đổ vào sidebar bên phải
		tukhoa: tukhoa,     // Để giữ lại chữ trong ô tìm kiếm
		firstImage: firstImage // Hàm lấy ảnh từ nội dung
	});
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

module.exports = router;