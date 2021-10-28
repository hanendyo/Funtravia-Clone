import { gql } from "apollo-boost";
const ConnectionFacebook = gql`
  mutation($client_token: String!) {
    connection_google(client_token: $client_token) {
      id
      response_time
      message
      code
    }
  }
`;
export default ConnectionFacebook;
