import { gql } from "apollo-boost";
const categoryArticle = gql`
  query(
    $country_id: ID!
    $category_id: [ID]
    $keyword: String
    $limit: Int
    $offset: Int
  ) {
    list_articel_country_category(
      country_id: $country_id
      category_id: $category_id
      keyword: $keyword
      limit: $limit
      offset: $offset
      withheader: false
    ) {
      page_info {
        hasNextPage
        offset
      }
      datas {
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
      }
    }
  }
`;
export default categoryArticle;
