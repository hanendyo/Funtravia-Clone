import { gql } from "apollo-boost";
const CreateItinerary = gql`
  mutation(
    $countries_id: ID!
    $cities_id: ID!
    $name: String!
    $start_date: String!
    $end_date: String!
    $isprivate: Boolean!
    $itinerary_buddy: [ID]!
    $category_id: ID
  ) {
    create_itinerary(
      input: {
        # user_id: "94ad0ef4-c102-4878-ac77-3ed0ab88d82f"
        countries_id: $countries_id
        cities_id: $cities_id
        name: $name
        start_date: $start_date
        end_date: $end_date
        isprivate: $isprivate
        itinerary_buddy: $itinerary_buddy
        category_id: $category_id
      }
    ) {
      id
      response_time
      message
      code
    }
  }
`;
export default CreateItinerary;
