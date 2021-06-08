import { gql } from "apollo-boost";
const CreateAlbumFeed = gql`
  mutation($title: String) {
    create_albums(title: $title) {
      id
      response_time
      message
      code
    }
  }
`;
export default CreateAlbumFeed;
