import { gql } from "apollo-boost";
const SearchUserQueryNew = gql`
  query(
    $keyword: String
    $cities_id: ID
    $countries_id: ID
    $first: Int!
    $after: String
  ) {
    user_searchv2_cursor_based(
      key: {
        keyword: $keyword
        cities_id: $cities_id
        countries_id: $countries_id
      }
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
        currentPage
        lastPage
      }
      edges {
        node {
          id
          username
          first_name
          last_name
          picture
          bio
          status_follower
          status_following
        }
        cursor
      }
    }
  }
`;
export default SearchUserQueryNew;
