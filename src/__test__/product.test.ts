import supertest from 'supertest';
import createServer from '../utils/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createProduct } from '../services/product.service';
import { signJwt } from '../utils/jwt.utils';
const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

let idPrefix = 1;

const getPayload = () => {
  idPrefix += 1;
  return {
    user: userId,
    title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
    description:
      'Designed for first-time DSLR owners who want impressive results straig Designed for first-time DSLR owners who want impressive results straig...',
    image: 'https://i.imgur.com/QlRphfQ.jpg',
    price: 879.99,
    productId: `${idPrefix}-product_zx5hfdibtc`,
  };
};

const userPayload = {
  _id: userId,
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
};

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    console.log(mongoServer);
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe('get product route', () => {
    describe('given the product does not exists', () => {
      it('should return a 404!', async () => {
        const productId = 'product-123';
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });
  });
  describe('get product route', () => {
    describe('given the product does exists', () => {
      it('should return a 200 status and the product', async () => {
        const product = await createProduct(getPayload());
        const productId = product.productId;
        const { body, statusCode } = await supertest(app).get(
          `/api/products/${productId}`,
        );
        expect(statusCode).toBe(200);
        expect(body.productId).toBe(productId);
      });
    });
  });
  // Create Product
  describe('Create Product', () => {
    describe('given the user is not logged in', () => {
      it('should return a 403', async () => {
        // check user session
        const { statusCode } = await supertest(app).post(`/api/products`);
        expect(statusCode).toBe(403);
      });
    });
    describe('given the user is logged in', () => {
      it('should create the product and return 200', async () => {
        const jwt = signJwt(userPayload, 'accessTokenPrivateKey');
        const { statusCode, body, error } = await supertest(app)
          .post(`/api/products`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(getPayload());
        console.log(error);
        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            'Designed for first-time DSLR owners who want impressive results straig Designed for first-time DSLR owners who want impressive results straig...',
          image: 'https://i.imgur.com/QlRphfQ.jpg',
          price: 879.99,
          productId: expect.any(String),
          title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
