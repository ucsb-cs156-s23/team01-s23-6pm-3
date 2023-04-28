import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { articleUtils } from "main/utils/articleUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);

const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    articleUtils.del(cell.row.values.id);
};

export default function ArticleTable({
    articles,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "ArticleTable",
}) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/articles/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/articles/details/${cell.row.values.id}`);
    };

    const columns = [
        {
            Header: "id",
            accessor: "id", // accessor is the "key" in the data
        },

        {
            Header: "Title",
            accessor: "title",
        },
        {
            Header: "Image",
            accessor: "image",
        },
        {
            Header: "Content",
            accessor: "content",
        },
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ];

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return (
        <OurTable
            data={articles}
            columns={columnsToDisplay}
            testid={testIdPrefix}
        />
    );
}

export { showCell };
