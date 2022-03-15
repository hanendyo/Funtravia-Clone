import { gql } from "apollo-boost";
const AlbumDetailItinerary = gql`
  query($id: ID!) {
    detail_assets_album_itinerary(album_id: $id) {
      id
      type
      filepath
      order
    }
  }
`;
export default AlbumDetailItinerary;
