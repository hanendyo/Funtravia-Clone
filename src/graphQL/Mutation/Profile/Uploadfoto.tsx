import { gql } from "apollo-boost";
const Uploadfoto = gql`
  mutation($picture: String!) {
    update_fotoprofile(picture: $picture) {
      id
      response_time
      message
      code
      path
    }
  }
`;
export default Uploadfoto;
