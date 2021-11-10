import { gql } from "apollo-boost";
const SearchDestinationQuery = gql`
  query($keyword: String, $cities_id: ID, $countries_id: ID, $province_id: ID) {
    destinationSearch(
      keyword: $keyword
      cities_id: $cities_id
      countries_id: $countries_id
      province_id: $province_id
    ) {
      id
      name
      rating
      cover
      count_review
      type {
        id
        name
        icon
      }
      cities {
        id
        name
      }
      countries {
        id
        name
      }
      greatfor {
        id
        name
        label
        icon
        slug
      }
      images {
        image
      }
      liked
      movie_location {
        id
        title
        description
        cover
        is_populer
        populer_order
      }
    }
  }
`;
export default SearchDestinationQuery;
