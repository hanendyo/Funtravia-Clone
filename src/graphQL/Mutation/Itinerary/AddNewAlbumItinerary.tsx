import { gql } from "apollo-boost";
const AddNewAlbumItinerary = gql`
  mutation($itinerary_id: ID!, $title: String) {
    create_itinerary_album(itinerary_id: $itinerary_id, title: $title) {
      id
      response_time
      message
      code
    }
  }
`;
export default AddNewAlbumItinerary;
