import supertest from "supertest";
import { prisma } from "../src/database";
import app from "../src/app";
import { createItem } from "./factory/itemsFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = await createItem();
    const result = await supertest(app).post("/items").send(item);
    expect(result.status).toEqual(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = await createItem();
    await supertest(app).post("/items").send(item);
    const result = await supertest(app).post("/items").send(item);
    expect(result.status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items").send();
    expect(result.status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = await createItem();
    const itemInDb = await supertest(app).post("/items").send(item);
    const id = itemInDb.body.id;
    console.log(id);
    const result = await supertest(app).get(`/items/${id}`).send();
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(itemInDb.body);
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const result = await supertest(app).get(`/items/1`).send();
    expect(result.status).toEqual(404);
  });
});

afterAll(() => {
  prisma.$disconnect;
});
