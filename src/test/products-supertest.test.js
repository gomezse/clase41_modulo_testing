// import supertest from "supertest";
// import { expect } from "chai";
// import { productsManager } from "../dao/models/mongoose/ProductsManager.js";
// import "./db.js";

// const requester = supertest("http://localhost:8084");

// describe("Products API", () => {
//   describe("POST /api/products",async () => {
//     const productMock1 = {
//       "title": "Producto 1",
//       "price": 250,
//       "stock":2,
//       "description":"descripcion del producto",
//       "code":"123ozxc",
//       "category":"categoria del producto"
//     };

//     it("should return a status 200 when creating a product", async () => {
//         try {
//         //   const response = await requester.post("/api/products").send(productMock1);                            
//           const response = await requester.get("/api/products"); 

//           console.log('response =======> ',response._body.info.payload);
//           expect(response.statusCode).to.be.equal(200);
//         } catch (error) {
//           console.error('Error during test:', error);
//           throw error;
//         }
//       });
      

//   });
// });

import supertest from "supertest";
import { expect } from "chai";
import mongoose from 'mongoose';
import "./db.js";  // Assuming this file handles the database connection

const requester = supertest("http://localhost:8084");


describe("Products API", () => {



  describe("POST /api/products", () => {
    const productMock1 = {
      "title": "Producto 1",
      "price": 250,
      "stock": 2,
      "description": "descripcion del producto",
      "code": "123ozxc",
      "category": "categoria del producto"
    };
    const productMock2 = {
        "title": "Producto 2",
        "price": 350,
        "stock": 3,
        "description": "descripcion del producto 2",
        "code": "123ozac",
        "category": "categoria del producto 2"
      };

    it("should return a status 200 when creating a product", async () => {
      try {
        const response = await requester.post("/api/products").send(productMock1);

        expect(response.statusCode).to.be.equal(200);
        expect(response.body.message).to.be.equal('Product created');
        expect(response.body.product).to.be.an('object');
        // You can add more specific assertions about the created product
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    it("should return a status 400 when creating a product with missing data", async () => {
      try {
        
        const response = await requester.post("/api/products").send({});

        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal('Required data is missing');
        
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });


});
