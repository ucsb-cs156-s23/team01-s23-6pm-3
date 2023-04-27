import React from "react";
import ArticleForm from "main/components/Articles/ArticleForm";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
    title: "components/Articles/ArticleForm",
    component: ArticleForm,
};

const Template = (args) => {
    return <ArticleForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => {
        console.log("Submit was clicked");
    },
};

export const Show = Template.bind({});

Show.args = {
    Article: articleFixtures.oneArticle,
    submitText: "",
    submitAction: () => {},
};
