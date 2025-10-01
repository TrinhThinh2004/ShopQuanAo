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