import { gql } from "apollo-boost";
const Deleteattach = gql`
  mutation($itinerary_custom_id: ID!, $tiny: String!) {
    delete_attach_custom(
      itinerary_custom_id: $itinerary_custom_id
      tiny: $tiny
    ) {
      id
      response_time
      message
      code
    }
  }
`;
export default Deleteattach;
