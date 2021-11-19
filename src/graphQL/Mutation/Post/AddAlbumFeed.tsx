import { gql } from "apollo-boost";
const AddAlbumFeed = gql`
  mutation($post_id: ID!, $album_id: ID!) {
    link_post_to_album(post_id: $post_id, album_id: $album_id) {
      id
      data {
        id
        caption
        longitude
        latitude
        location_name
        liked
        comment_count
        response_count
        created_at
        updated_at
        media_orientation
        assets {
          id
          type
          filepath
          order
          is_posted
          created_at
        }
        user {
          id
          username
          first_name
          last_name
          picture
          ismyfeed
        }
        album {
          id
          title
          cover
          itinerary {
            id
            name
          }
        }
      }
      response_time
      message
      code
    }
  }
`;
export default AddAlbumFeed;
