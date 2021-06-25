import { gql } from "apollo-boost";
const ListFotoAlbum = gql`
  query($album_id: ID!) {
    detail_media_album(album_id: $album_id) {
      id
      type
      filepath
      order
      is_posted
      post_id
      created_at
      upload_by {
        id
        username
        first_name
        last_name
        picture
      }
    }
  }
`;
export default ListFotoAlbum;
