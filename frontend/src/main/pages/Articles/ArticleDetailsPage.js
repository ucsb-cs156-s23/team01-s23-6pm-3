import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ArticleTable from 'main/components/Articles/ArticleTable';
import { articleUtils } from 'main/utils/articleUtils';

export default function ArticleDetailsPage() {
  let { id } = useParams();

  const response = articleUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Article Details</h1>
        <ArticleTable articles={[response.article]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
