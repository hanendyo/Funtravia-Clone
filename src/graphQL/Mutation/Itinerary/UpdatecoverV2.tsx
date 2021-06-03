import { gql } from "apollo-boost";
const Updatecover = gql`
  mutation($file: Upload!, $itinerary_id: ID!) {
    upload_cover_itinerary_v2(file: $file, itinerary_id: $itinerary_id) {
      id
      message
    }
  }
`;
export default Updatecover;
