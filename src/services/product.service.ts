import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import logger from '../utils/logger';
import ProductModel, { ProductDocument } from '../models/product.model';
import { databaseResponseTimeHistogram } from '../utils/metrics';

export async function createProduct(
  input: DocumentDefinition<
    Omit<ProductDocument, 'createdAt' | 'updatedAt' | 'productId'>
  >,
) {
  const metriclabels = {
    operation: 'createProduct',
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProductModel.create(input);
    timer({ ...metriclabels, success: 200 });
    return result;
  } catch (err: any) {
    timer({ ...metriclabels, success: 200 });
    logger.error(err.message);
    throw new Error(err.message);
  }
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
) {
  return ProductModel.findOne(query, {}, options);
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions,
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function findAndDeleteProduct(
  query: FilterQuery<ProductDocument>,
) {
  return ProductModel.deleteOne(query);
}
