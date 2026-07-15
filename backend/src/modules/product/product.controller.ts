import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { catchAsync } from "../../common/utils/catchAsync";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getProductsByFilters = catchAsync(async (req: Request, res: Response) => {
    const gender = req.query.gender || req.headers.gender;
    const result = await this.productService.getProductsByFilters({
      ...req.query,
      gender,
    });
    return res.status(200).json(result);
  });

  getProductById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await this.productService.getProductById(id);
    return res.status(200).json(product);
  });

  getSimilarProducts = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const similar = await this.productService.getSimilarProducts(id);
    return res.status(200).json(similar);
  });

  getMostLikedProducts = catchAsync(async (req: Request, res: Response) => {
    const mostLiked = await this.productService.getMostLikedProducts();
    return res.status(200).json(mostLiked);
  });

  getBestSeller = catchAsync(async (req: Request, res: Response) => {
    const bestSellers = await this.productService.getBestSellers();
    return res.status(200).json(bestSellers);
  });

  getNewArrivals = catchAsync(async (req: Request, res: Response) => {
    const newArrivals = await this.productService.getNewArrivals();
    return res.status(200).json(newArrivals);
  });

  // Admin Controller Methods
  getAllProductsAdmin = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await this.productService.getAllProductsAdmin(page, limit);
    return res.status(200).json(data);
  });

  searchProductsAdmin = catchAsync(async (req: Request, res: Response) => {
    const term = (req.query.term as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await this.productService.searchProductsAdmin(term, page, limit);
    return res.status(200).json(data);
  });

  createProduct = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const product = await this.productService.createProduct(req.body, userId);
    return res.status(201).json(product);
  });

  updateProduct = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await this.productService.updateProduct(id, req.body);
    return res.status(200).json(product);
  });

  deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.productService.deleteProduct(id);
    return res.status(200).json(result);
  });
}
