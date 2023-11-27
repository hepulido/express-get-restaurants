const request = require("supertest");
const app = require("./src/app")
const Restaurant = require("./models/index")
const syncSeed = require("./seed")
let restQuantity;

beforeAll(async() => {
    await syncSeed ()
    const restaurants = await Restaurant.findAll({})
    restQuantity = restaurants.length;
})
 describe("Check restaurant routes", () => {
    test("should return 200 statuscode", async () => {
      const response = await request(app).get("/restaurants");
      expect(response.statusCode).toBe(200);
    })
    test("should return an array", async () => {
        const response = await request(app).get("/restaurants");
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("cuisine")
      })
      test("should return correct length", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.body.length).toBe(restQuantity);
      })
      test("should return the correct data", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.body).toContainEqual(
            expect.objectContaining({
                id: 1,
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
      })
      test("should return the correct data", async () => {
        const response = await request(app).get("/restaurants/1");
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
      })
      test("should return with a new value", async () => {
        const response = await request(app).post("/restaurants").send({name:"asd", location: "wsa", cuisine: "jskd"})
        expect(response.body.length).toEqual(restQuantity + 1 );
      })
      test("should return with an apdated value", async () => {
        await request(app).put("/restaurants/1").send({name:"adf", location: "wsa", cuisine: "jskd"})
        const restaurant = await  Restaurant.findByPk(1)
        expect(restaurant.name).toEqual("adf");
      })
      test("should delete db entry id", async () => {
        await request(app).delete("/restaurants/1")
        const restaurant = await  Restaurant.findAll({})
        expect(restaurant.length).toEqual(restQuantity);
      })
      test("should check for validation", async () => {
       const response = await request(app).post("/restaurants").send({name:""})
       expect(response.body).toHaveProperty("errors")
       expect(Array.isArray(response.body.errors)).toBe(true);
      })
 })