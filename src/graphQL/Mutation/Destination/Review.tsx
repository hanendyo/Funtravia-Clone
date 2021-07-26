import { gql } from "apollo-boost";
const ReviewUpload = gql`
  mutation($id: ID!, $rating: Int!, $ulasan: String, $foto: [Upload]) {
    create_review(
      input: {
        destination_id: $id
        rating: $rating
        ulasan: $ulasan
        foto: $foto
      }
    ) {
      id
      response_time
      message
      code
    }
  }
`;
export default ReviewUpload;
