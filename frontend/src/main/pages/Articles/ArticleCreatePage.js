import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticleForm from "main/components/Articles/ArticleForm";
import { useNavigate } from 'react-router-dom'
import { articleUtils } from 'main/utils/articleUtils';

export default function ArticleCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (article) => {
    const createdArticle = articleUtils.add(article);
    console.log("createdArticle: " + JSON.stringify(createdArticle));
    navigate("/articles");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Article</h1>
        <ArticleForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
