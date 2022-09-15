import { faker } from "@faker-js/faker";

export async function createItem() {
  const item = {
    title: faker.lorem.words(3),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: faker.datatype.number(),
  };
  return item;
}
