import multer from 'multer';
import { IMAGE_FILE_TYPES } from '../interfaces/constants/fileUploadTypes';


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = IMAGE_FILE_TYPES[file.mimetype];
		let uploadError: any = new Error('Invalid image type');
		if (isValid) {
			uploadError = null;
		}
		cb(uploadError, 'public/uploads/images');
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.split(' ').join('-');
		const fileExtension = IMAGE_FILE_TYPES[file.mimetype];

		cb(null, `${fileName}-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${fileExtension}`);
	},
});

export const uploadOptions = multer({ storage: storage });
