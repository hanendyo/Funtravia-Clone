import { gql } from "apollo-boost";
const SearchEventQuery = gql`
  query($keyword: String, $cities_id: ID, $countries_id: ID, $province_id: ID) {
    event_search(
      keyword: $keyword
      cities_id: $cities_id
      countries_id: $countries_id
      province_id: $province_id
    ) {
      id
      name
      category {
        id
        name
      }
      is_repeat
      start_date
      end_date
      ticket_link
      city {
        id
        name
      }
      country {
        id
        name
      }
      description
      price
      image
      cover
      latitude
      longitude
      address
      vendor {
        id
        name
        cover
      }
      open
      ticket {
        id
        name
        price
        description
      }
      images {
        image
      }
      liked
    }
  }
`;
export default SearchEventQuery;
