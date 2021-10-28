import { gql } from "apollo-boost";
const unConnectionFacebook= gql`
  mutation($id: ID!) {
    unconnection_facebook(id: $id) {
      id
      response_time
      message
      code
    }
  }
`;
export default unConnectionFacebook;
