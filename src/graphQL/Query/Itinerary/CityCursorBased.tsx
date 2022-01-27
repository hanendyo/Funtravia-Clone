import { gql } from "apollo-boost";
const CityCursorBased = gql`
query($keyword: String, $countries_id: ID!, $first: Int!, $after: String){
    city_search_cursor_based(keyword: $keyword, countries_id: $countries_id, first : $first, after:$after){
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
        currentPage
        lastPage
      }
      edges{
        node{
          id
          name
          cover
          latitude
          longitude
          description
        }
        cursor
      }
      
    }
  }
`;
export default CityCursorBased;
