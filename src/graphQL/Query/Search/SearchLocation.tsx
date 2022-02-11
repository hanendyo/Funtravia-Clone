import { gql } from "apollo-boost";
const SearchLocationQuery = gql`
  query(
    $keyword: String
    $cities_id: ID
    $province_id: ID
    $countries_id: ID
    $limit: Int!
    $offset: Int!
  ) {
    search_location_cursor_based(
      keyword: $keyword
      cities_id: $cities_id
      province_id: $province_id
      countries_id: $countries_id
      limit: $limit
      offset: $offset
    ) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        name
        cover
        type
        head1
        head2
      }
    }
  }
`;
export default SearchLocationQuery;
