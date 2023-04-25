// get articles from local storage
const get = () => {
    const articleValue = localStorage.getItem("articles");
    if (articleValue === undefined) {
        const articleCollection = { nextId: 1, articles: [] };
        return set(articleCollection);
    }
    const articleCollection = JSON.parse(articleValue);
    if (articleCollection === null) {
        const articleCollection = { nextId: 1, articles: [] };
        return set(articleCollection);
    }
    return articleCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { error: "id is a required parameter" };
    }
    const articleCollection = get();
    const articles = articleCollection.articles;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = articles.findIndex((r) => r.id == id);
    if (index === -1) {
        return { error: `article with id ${id} not found` };
    }
    return { article: articles[index] };
};

// set articles in local storage
const set = (articleCollection) => {
    localStorage.setItem("articles", JSON.stringify(articleCollection));
    return articleCollection;
};

// add a article to local storage
const add = (article) => {
    const articleCollection = get();
    article = { ...article, id: articleCollection.nextId };
    articleCollection.nextId++;
    articleCollection.articles.push(article);
    set(articleCollection);
    return article;
};

// update a article in local storage
const update = (article) => {
    const articleCollection = get();

    const articles = articleCollection.articles;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = articles.findIndex((r) => r.id == article.id);
    if (index === -1) {
        return { error: `article with id ${article.id} not found` };
    }
    articles[index] = article;
    set(articleCollection);
    return { articleCollection: articleCollection };
};

// delete a article from local storage
const del = (id) => {
    if (id === undefined) {
        return { error: "id is a required parameter" };
    }
    const articleCollection = get();
    const articles = articleCollection.articles;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = articles.findIndex((r) => r.id == id);
    if (index === -1) {
        return { error: `article with id ${id} not found` };
    }
    articles.splice(index, 1);
    set(articleCollection);
    return { articleCollection: articleCollection };
};

const articleUtils = {
    get,
    getById,
    add,
    update,
    del,
};

export { articleUtils };
