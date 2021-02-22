import { gql } from "apollo-boost";
const liked = gql`
  mutation($destination_id: ID!) {
    setDestination_wishlist(destination_id: $destination_id, qty: 1) {
      response_time
      message
      status
      code
    }
  }
`;
export default liked;
