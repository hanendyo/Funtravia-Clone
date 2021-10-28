import { gql } from "apollo-boost";
const unConnectionGoogle= gql`
  mutation($id: ID!) {
    unconnection_google(id: $id) {
      id
      response_time
      message
      code
    }
  }
`;
export default unConnectionGoogle;
