import { gql } from "apollo-boost";
const Article = gql`
  query($article_id: ID!) {
    article_byid(article_id: $article_id) {
      id
      title
      date
      type
      position
      firstimg
      firsttxt
      countries {
        id
        name
      }
      category {
        id
        name
        icon
        slug
      }
      content {
        id
        type
        title
        text
        image
        order
      }
    }
  }
`;
export default Article;
