import { gql } from "apollo-boost";
const ReviewUpload = gql`
  mutation($id: ID, $rating: Integer, $ulasan: String, $foto: [Upload]) {
    create_review(
      input: {
        destination_id: $id
        rating: $rating
        ulasan: $ulasan
        foto: $foto
      }
    ) {
      response_time
      message
      status
      code
    }
  }
`;
export default ReviewUpload;
