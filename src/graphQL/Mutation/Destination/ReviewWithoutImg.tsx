import { gql } from "apollo-boost";
const ReviewUpload = gql`
  mutation($id: ID!, $rating: Int, $ulasan: String) {
    create_review_without_img(
      input: { destination_id: $id, rating: $rating, ulasan: $ulasan }
    ) {
      id
      response_time
      message
      code
    }
  }
`;
export default ReviewUpload;
