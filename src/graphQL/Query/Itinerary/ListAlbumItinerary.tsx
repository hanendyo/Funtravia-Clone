import { gql } from "apollo-boost";
const ListAlbumItinerary = gql`
  query($itinerary_id: ID!, $keyword: String) {
    album_itinerary_list(itinerary_id: $itinerary_id, keyword: $keyword) {
      id
      title
      cover
      count_media
      media {
        id
        type
        filepath
        order
        is_posted
        post_id
        created_at
      }
    }
  }
`;
export default ListAlbumItinerary;
