import { gql } from "apollo-boost";
const Unliked = gql`
  mutation($destination_id: ID!) {
    unset_wishlist_destinasi(destination_id: $destination_id) {
      response_time
      message
      status
      code
    }
  }
`;
export default Unliked;
