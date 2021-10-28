import { gql } from "apollo-boost";
const AkunConnect = gql`
  query {
    user_connection_account{
      gmail{
        id
        email
      }
      facebook{
        id
        name
      }
    }
  }
`;

export default AkunConnect;
