import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "./db.js"; // Assuming this file handles the database connection
import { productsManager } from "../dao/models/mongoose/ProductsManager.js";

const requester = supertest("http://localhost:8084");

describe("Products API", () => {
  const productMock1 = {
    title: "Producto 1",
    price: 250,
    stock: 2,
    description: "descripcion del producto",
    code: "123ozxc",
    category: "categoria del producto",
  };

  const productMock2 = {
    title: "Producto 2",
    price: 350,
    stock: 3,
    description: "descripcion del producto 2",
    code: "123ozac",
    category: "categoria del producto 2",
  };

  describe("POST--> add product --> /api/products", () => {
    before(async () => {
      await mongoose.connection.collection("products").deleteMany({});
    });

    it("should return a status 200 when creating a product", async () => {
      try {
        const response = await requester
          .post("/api/products")
          .send(productMock1);

        expect(response.statusCode).to.be.equal(200);
        expect(response.body.message).to.be.equal("Product created");
        expect(response.body.product).to.be.an("object");
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("should return status 500 when creating a product with duplicate code", async () => {
      try {
        const response = await requester
          .post("/api/products")
          .send(productMock1);

        expect(response.statusCode).to.be.equal(500);
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("should return a status 400 when creating a product with missing data", async () => {
      try {
        const response = await requester.post("/api/products").send({});
        expect(response.statusCode).to.be.equal(400);
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });
  });

  describe("GET --> Get product by id --> /api/products/:pid", () => {
    it("should return a 'Product Found' when get product by id", async () => {
      try {
        const product = await productsManager.findOne();
        const response = await requester.get(`/api/products/${product._id}`);

        expect(response.statusCode).to.be.equal(200);
        expect(response.body.message).to.be.equal("Product found");
        expect(response.body.product).to.be.an("object");
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("should return 'Cast Error' when the id cannot be cast", async () => {
      try {
        const fakeId = 122;
        const response = await requester.get(`/api/products/${fakeId}`);

        expect(response.statusCode).to.be.equal(200);
        expect(response._body.product.name).to.be.equal("CastError");
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });
  });

  describe("GET --> Get all products --> /api/products", () => {
    it("Should return a 'No Products',not empty body and a status of 200 if there aren't products to list. ", async () => {
      try {
        const product = await productsManager.findOne();
        await requester.delete(`/api/products/${product._id}`);
        const response = await requester.get(`/api/products`);

        expect(response.statusCode).to.be.equal(200);
        expect(response._body.message).that.is.not.empty;
        expect(response._body.message).to.be.equal("No products");
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("Should return a non-empty array and a status of 200 if there are products to list. ", async () => {
      try {
        await requester.post("/api/products").send(productMock1);
        await requester.post("/api/products").send(productMock2);
        const response = await requester.get(`/api/products`);

        expect(response.statusCode).to.be.equal(200);
        expect(response._body.info.payload).to.be.an("array").that.is.not.empty;
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });
  });

  describe("PUT --> Update product by id --> /api/products/:pid", () => {
    it("Should return the updated product if it was modified correctly", async () => {
      try {
        const productToUpdate = {
          title: "titulo luego del update",
        };
        const product = await productsManager.findOne();
        const response = await requester
          .put(`/api/products/${product._id}`)
          .send(productToUpdate);

        expect(response._body.message).to.be.equal("Product updated");
        expect(response._body.product.title).to.be.equal(
          "titulo luego del update"
        );
        expect(response._body.product).that.be.an("object");
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("Should return 'Product not updated' if it could not be modified ", async () => {
      try {
        const product = await productsManager.findOne();
        const response = await requester
          .put(`/api/products/${product._id}`)
          .send();

        expect(response.status).to.be.equal(500);
        expect(response._body.message).to.be.equal("Product not updated");
        expect(response._body.product).that.is.empty;
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });
  });

  describe("DELETE --> DELETE product by id --> /api/products/:pid", () => {
    let idToDelete;
    
    it("Should return the updated product if it was modified correctly", async () => {
      try {      
        const product = await productsManager.findOne();
        idToDelete = product._id;
        const response = await requester.delete(`/api/products/${idToDelete}`);

        expect(response.statusCode).to.be.equal(200);        
        expect(response._body.message).to.be.equal("Product deleted");
        
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });

    it("Should return deletedCount = 0 when an already deleted product is deleted ", async () => {
      try {              
        const response = await requester.delete(`/api/products/${idToDelete}`);
        
        expect(response.statusCode).to.be.equal(200);        
        expect(response._body.deletedProduct.deletedCount).to.be.equal(0);        
      } catch (error) {
        console.error("Error during test:", error);
        throw error;
      }
    });
  });
});
