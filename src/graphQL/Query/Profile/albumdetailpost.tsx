import { gql } from "apollo-boost";
const album = gql`
  query($id: ID!, $type: String!) {
    all_albums_post(id: $id, type: $type) {
      id
      post_id
      type
      filepath
      created_at
      updated_at
    }
  }
`;
export default album;
