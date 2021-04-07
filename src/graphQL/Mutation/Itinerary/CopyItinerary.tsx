import { gql } from "apollo-boost";
const copyItinerary = gql`
  mutation(
    $itinerary_id: ID!
    $start_date: String!
    $title: String!
    $category_id: ID!
  ) {
    duplicate_itinerary(
      itinerary_id: $itinerary_id
      start_date: $start_date
      title: $title
      category_id: $category_id
    ) {
      id
      isprivate
      response_time
      message
      code
    }
  }
`;
export default copyItinerary;
