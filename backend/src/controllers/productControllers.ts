import { Request, Response } from 'express';
import { Category } from '../models/category';
import { Product } from '../models/product';

export const getAllProducts = async (req: Request, res: Response) => {
	const filter = req.query.categories ? { category: String(req.query.categories).split(',') } : {};

	try {
		const retrievedProducts = await Product.find(filter).select(['-id']).populate({
			path: 'category',
			model: Category,
		});
		res.status(200).json(retrievedProducts);
	} catch (error) {
		res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve product',
		});
	}
};

export const createProducts = async (req: Request, res: Response) => {
	try {
		const { name, description, richDescription, brand, price, category, countInStock, rating, numReviews, isFeatured } =
      req.body;
    
    const file = req.file
    if (!file) {
      return res.status(400).json({success: false, message: "No image in request"})
    }
		const productCategory = await Category.findById({ _id: category });
		if (!productCategory) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Category',
			});
		}

		const fileName = req.file.filename;
		const basePath = `${req.protocol}://${req.get('host')}/public/uploads/images/`;

		let createdProduct = new Product({
			name,
			description,
			richDescription,
			image: `${basePath}${fileName}`,
			brand,
			price,
			category,
			countInStock,
			rating,
			numReviews,
			isFeatured,
		});
		createdProduct = await createdProduct.save();
		if (createdProduct) {
			return res.status(201).json(createdProduct);
		} else {
			return res.status(404).json({ success: false, message: 'Product creation operation failed' });
		}
	} catch (error) {
		res.status(500).json({
			error: error,
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export const getProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		let retrievedProduct = await Product.findById(productId).populate({
			path: 'category',
			model: Category,
		});
		if (retrievedProduct) {
			return res.status(201).json(retrievedProduct);
		} else {
			return res.status(400).json({
				success: false,
				message: 'Product retrieval operation failed',
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error.message,
			success: false,
			message: 'Failed to retrieve product',
		});
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		const {
			name,
			description,
			richDescription,
			image,
			brand,
			price,
			category,
			countInStock,
			rating,
			numReviews,
			isFeatured,
		} = req.body;

		const retrievedCategory = await Category.findById({ _id: category });

		if (!retrievedCategory) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Category',
			});
		}

		const product = await Product.findById({ _id: productId })
		if(!product) res.status(400).json({success: false, message: "Invalid Product!"})

		const file = req.file
		let imageUrlPath;
		if (file) {
			const fileName = file.filename
			const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
			imageUrlPath = `${basePath}${fileName}`
		} else {
			imageUrlPath = product.image
		}

		let updateProduct = await Product.findByIdAndUpdate(
			productId,
			{
				name,
				description,
				richDescription,
				image: imageUrlPath,
				brand,
				price,
				category,
				countInStock,
				rating,
				numReviews,
				isFeatured,
			},
			{ new: true }
		);

		if (updateProduct) {
			return res.status(201).json(updateProduct);
		} else {
			return res.status(404).json({
				success: false,
				message: `Product with id ${productId} not found`,
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error, message: 'Internal Server Error' });
	}
};

export const updateProductGalary = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		const retrievedProduct = await Product.findById({ _id: productId });

		if (!retrievedProduct) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Product Id',
			});
		}
		const files: any = req.files

		let imageUrlPaths: Array<string> = [];
		const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
		if (files) {
			files.map((file: any) => {
				imageUrlPaths.push(`${basePath}${file.fileName}`);
			})
		}

		
		const product = await Product.findByIdAndUpdate({ _id: productId }, {
			images: imageUrlPaths
		})

		if (!product) {
			return res.status(400).json({
				success: false,
				message: "The product could not be updated"
			})
		}
		res.json(product)

	} catch (error) {
		return res.status(500).json({ error: error, message: 'Internal Server Error' });
	}
};


export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		let productFound = await Product.findByIdAndRemove(productId);
		if (productFound) {
			return res.status(200).json({
				success: true,
				message: `Product with id ${productId} successfully deleted`,
			});
		} else {
			return res.status(404).json({
				success: false,
				message: `Product with id ${productId} not found`,
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: error,
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export const getProductCount = async (req: Request, res: Response) => {
	try {
		const productCount: number = await Product.find().countDocuments();
		if (!productCount) {
			return res.status(400).json({ success: false, message: 'No products found' });
		}
		return res.json({ productCount: productCount });
	} catch (error) {
		return res.json(500).json({ error: error, success: false, message: 'Internal Server Error' });
	}
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
	try {
		const count = req.params.count ? Number(req.params.count) : 0;
		const featuredProducts = await Product.find({ isFeatured: true }).limit(count);
		if (!featuredProducts) {
			return res.status(400).json({ success: false, message: 'No featured products found' });
		}
		return res.json(featuredProducts);
	} catch (error) {
		return res.status(500).json({ error: error, success: false, message: 'Internal Server Error' });
	}
};

