import { gql } from "apollo-boost";
const review = gql`
  query($id: ID!) {
    user_reviewbyid(id: $id) {
      id
      name
      rating
      ulasan
      isfrom
      create_at
      images {
        image
      }
      id_item
    }
  }
`;
export default review;
