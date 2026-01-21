const WordService = require("../services/word-service");

describe("WordService (unit)", () => {
  let wordService;
  let mockCollection;

  beforeEach(async () => {
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            toArray: jest
              .fn()
              .mockResolvedValue([{ word: "test", translation: "тест" }]),
          }),
        }),
      }),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
    };

    const fakeDatabase = {
      getCollection: async () => mockCollection,
    };

    wordService = new WordService(fakeDatabase);
    await wordService.init();
  });

  test("addWord inserts word", async () => {
    mockCollection.insertOne.mockResolvedValue({
      insertedId: "123",
    });

    const result = await wordService.addWord({
      word: "hello",
      translation: "привіт",
    });

    expect(result.success).toBe(true);
    expect(mockCollection.insertOne).toHaveBeenCalled();
  });

  test("getAllWords returns words", async () => {
    const words = await wordService.getAllWords();

    expect(words.length).toBe(1);
    expect(words[0].word).toBe("test");
  });

  test("deleteWord deletes word", async () => {
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await wordService.deleteWord("test");

    expect(result).toBe(true);
  });
});
