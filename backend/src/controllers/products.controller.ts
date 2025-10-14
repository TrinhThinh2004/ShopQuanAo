import { Request, Response } from 'express';
import Product from '../models/Product';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [['product_id', 'DESC']],
    });

    return res.json({
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ data: product });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(201).json({ data: newProduct });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    return res.json({ data: product });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.json({ message: 'Product deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

