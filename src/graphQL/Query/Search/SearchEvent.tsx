import { gql } from "apollo-boost";
const SearchEventQuery = gql`
  query($keyword: String) {
    event_search(keyword: $keyword) {
      id
      name
      start_date
      end_date
      ticket_link
      description
      image
      latitude
      longitude
      open
      address
      vendor {
        id
        name
        cover
      }
      category {
        id
        name
      }
      country {
        id
        name
      }
      city {
        id
        name
      }
      images {
        image
      }
      ticket {
        id
        name
        price
        description
      }
      liked
    }
  }
`;
export default SearchEventQuery;
