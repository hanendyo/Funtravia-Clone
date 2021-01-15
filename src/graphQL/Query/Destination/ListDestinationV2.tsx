import { gql } from "apollo-boost";
const ListDestination = gql`
  query(
    $keyword: String
    $type: [ID]
    $countries: [ID]
    $cities: [ID]
    $goodfor: [ID]
    $facilities: [ID]
    $rating: [Int]
  ) {
    destinationList_v2(
      key: {
        keyword: $keyword
        type: $type
        countries: $countries
        cities: $cities
        goodfor: $goodfor
        facilities: $facilities
        rating: $rating
      }
    ) {
      id
      name
      rating
      count_review
      liked
      cities {
        id
        name
      }
      countries {
        id
        name
      }
      greatfor {
        label
        icon
      }
      images {
        image
      }
    }
  }
`;
export default ListDestination;
