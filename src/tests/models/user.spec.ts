import { User, UserStore } from "../../models/user";

const store = new UserStore();

describe("User model", () => {
  const user: User = {
    firstname: "John",
    lastname: "Doe",
    username: "johndoe",
    password: "donutmaster33",
  };

  async function createUser(user: User): Promise<User> {
    return store.create(user);
  }

  async function deleteUser(id: number): Promise<boolean> {
    return store.delete(id);
  }

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });
  it("should have an authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });
  it("create method should add a user", async () => {
    const userCreated: User = await createUser(user);
    expect(userCreated.firstname).toEqual(user.firstname);
    expect(userCreated.lastname).toEqual(user.lastname);
    expect(userCreated.username).toEqual(user.username);

    await deleteUser(userCreated.id as unknown as number);
  });
  it("index method should return users list", async () => {
    const userCreated: User = await createUser(user);

    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);

    await deleteUser(userCreated.id as unknown as number);
  });
  it("show method should return a user", async () => {
    const userCreated: User = await createUser(user);
    const result = await store.show(userCreated.id as unknown as number);
    expect(result).toEqual(userCreated);

    await deleteUser(userCreated.id as unknown as number);
  });
  it("delete method should delete a user", async () => {
    const userCreated: User = await createUser(user);
    const result = await store.delete(userCreated.id as unknown as number);
    expect(result).toEqual(true);
  });
  it("authenticate method should return a user", async () => {
    const userCreated: User = await createUser(user);
    const result = await store.authenticate(
      userCreated.firstname,
      userCreated.password
    );
    if (result) {
      expect(result.username).toEqual(userCreated.username);
    }

    await deleteUser(userCreated.id as unknown as number);
  });
});
