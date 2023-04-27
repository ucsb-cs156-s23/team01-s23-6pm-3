import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { articleUtils } from "main/utils/articleUtils";
import ArticleForm from "main/components/Articles/ArticleForm";
import { useNavigate } from "react-router-dom";

export default function ArticleEditPage() {
    let { id } = useParams();

    let navigate = useNavigate();

    const response = articleUtils.getById(id);

    const onSubmit = async (article) => {
        const updatedArticle = articleUtils.update(article);
        console.log("updatedArticle: " + JSON.stringify(updatedArticle));
        navigate("/articles");
    };

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Article</h1>
                <ArticleForm
                    submitAction={onSubmit}
                    buttonLabel={"Update"}
                    initialContents={response.article}
                />
            </div>
        </BasicLayout>
    );
}
