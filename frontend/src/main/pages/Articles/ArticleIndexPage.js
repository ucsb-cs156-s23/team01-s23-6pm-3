import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticleTable from 'main/components/Articles/ArticleTable';
import { articleUtils } from 'main/utils/articleUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function ArticleIndexPage() {

    const navigate = useNavigate();

    const articleCollection = articleUtils.get();
    const articles = articleCollection.articles;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`ArticleIndexPage deleteCallback: ${showCell(cell)})`);
        articleUtils.del(cell.row.values.id);
        navigate("/articles");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/articles/create">
                    Create Article
                </Button>
                <h1>Articles</h1>
                <ArticleTable articles={articles} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}