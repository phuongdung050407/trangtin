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

	var cm = await ChuDe.find();

	// Xử lý tìm kiếm bài viết
	var bv = await BaiViet({
		KiemDuyet: 1, $or: [
			{ TieuDe: { $regex: new RegExp(tukhoa, "i") } },
			{ TomTat: { $regex: new RegExp(tukhoa, "i") } }
		]
	})
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.exec();

	res.render('timkiem', {
		title: 'Kết quả tìm kiếm cho: ' + tukhoa,
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		tukhoa: tukhoa,
		firstImage: firstImage
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