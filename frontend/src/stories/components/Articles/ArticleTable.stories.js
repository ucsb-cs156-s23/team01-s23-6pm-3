import React from "react";
import ArticleTable from "main/components/Articles/ArticleTable";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
    title: "components/Articles/ArticleTable",
    component: ArticleTable,
};

const Template = (args) => {
    return <ArticleTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
    articles: [],
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    articles: articleFixtures.threeArticles,
    showButtons: false,
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    articles: articleFixtures.threeArticles,
    showButtons: true,
};
