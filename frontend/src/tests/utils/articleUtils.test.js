import { articleFixtures } from "fixtures/articleFixtures";
import { articleUtils } from "main/utils/articleUtils";

describe("articleUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "articles".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "articles") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {
        test("When articles is undefined in local storage, should set to empty list", () => {
            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.get();

            // assert
            const expected = { nextId: 1, articles: [] };
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("articles", expectedJSON);
        });

        test("When articles is null in local storage, should set to empty list", () => {
            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.get();

            // assert
            const expected = { nextId: 1, articles: [] };
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("articles", expectedJSON);
        });

        test("When articles is [] in local storage, should return []", () => {
            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 1, articles: [] })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.get();

            // assert
            const expected = { nextId: 1, articles: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When articles is JSON of three articles, should return that JSON", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;
            const mockArticleCollection = {
                nextId: 10,
                articles: threeArticles,
            };

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock(mockArticleCollection)
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.get();

            // assert
            expect(result).toEqual(mockArticleCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("getById", () => {
        test("Check that getting a article by id works", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;
            const idToGet = threeArticles[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            // act
            const result = articleUtils.getById(idToGet);

            // assert

            const expected = { article: threeArticles[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing article returns an error", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            // act
            const result = articleUtils.getById(99);

            // assert
            const expectedError = `article with id 99 not found`;
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            // act
            const result = articleUtils.getById();

            // assert
            const expectedError = `id is a required parameter`;
            expect(result).toEqual({ error: expectedError });
        });
    });
    describe("add", () => {
        test("Starting from [], check that adding one article works", () => {
            // arrange
            const article = articleFixtures.oneArticle[0];
            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 1, articles: [] })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.add(article);

            // assert
            expect(result).toEqual(article);
            expect(setItemSpy).toHaveBeenCalledWith(
                "articles",
                JSON.stringify({
                    nextId: 2,
                    articles: articleFixtures.oneArticle,
                })
            );
        });
    });

    describe("update", () => {
        test("Check that updating an existing article works", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;
            const updatedArticle = {
                ...threeArticles[0],
                name: "Updated Name",
            };
            const threeArticlesUpdated = [
                updatedArticle,
                threeArticles[1],
                threeArticles[2],
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.update(updatedArticle);

            // assert
            const expected = {
                articleCollection: {
                    nextId: 5,
                    articles: threeArticlesUpdated,
                },
            };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith(
                "articles",
                JSON.stringify(expected.articleCollection)
            );
        });
        test("Check that updating an non-existing article returns an error", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedArticle = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description",
            };

            // act
            const result = articleUtils.update(updatedArticle);

            // assert
            const expectedError = `article with id 99 not found`;
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a article by id works", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;
            const idToDelete = threeArticles[1].id;
            const threeArticlesUpdated = [threeArticles[0], threeArticles[2]];

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.del(idToDelete);

            // assert

            const expected = {
                articleCollection: {
                    nextId: 5,
                    articles: threeArticlesUpdated,
                },
            };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith(
                "articles",
                JSON.stringify(expected.articleCollection)
            );
        });
        test("Check that deleting a non-existing article returns an error", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = articleUtils.del(99);

            // assert
            const expectedError = `article with id 99 not found`;
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {
            // arrange
            const threeArticles = articleFixtures.threeArticles;

            const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
            getItemSpy.mockImplementation(
                createGetItemMock({ nextId: 5, articles: threeArticles })
            );

            // act
            const result = articleUtils.del();

            // assert
            const expectedError = `id is a required parameter`;
            expect(result).toEqual({ error: expectedError });
        });
    });
});
