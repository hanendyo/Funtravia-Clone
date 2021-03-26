import { gql } from "apollo-boost";
const commentpost = gql`
  mutation($post_id: ID!, $text: String) {
    comment_post(input: { post_id: $post_id, text: $text }) {
      data {
        id
        text
        user {
          id
          username
          first_name
          last_name
          picture
        }
        created_at
        updated_at
      }
      response_time
      message
      code
    }
  }
`;
export default commentpost;
