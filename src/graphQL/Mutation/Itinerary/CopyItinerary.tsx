import { gql } from "apollo-boost";
const copyItinerary = gql`
  mutation {
    duplicate_itinerary(
      itinerary_id: "ce87c061-3b4d-4935-a18d-4788a8601b38"
      start_date: "2021-03-10"
      title: "Duplicate Pulang kampung"
      category_id: ""
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
