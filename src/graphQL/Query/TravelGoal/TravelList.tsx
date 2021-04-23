import { gql } from "apollo-boost";
const travelgoal_firsts = gql`
  query(
    $limit: Int!
    $offset: Int!
    $category_id: [ID]
    $keyword: String # $order: "new",
  ) {
    travelgoal_list(
      limit: $limit
      offset: $offset
      category_id: $category_id
      keyword: $keyword
      order: "new"
    ) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        title
        firstimg
        firsttxt
        date
        created_at
        updated_at
        category {
          id
          name
          slug
          icon
        }
        cover
        description
      }
    }
  }
`;
export default travelgoal_firsts;
