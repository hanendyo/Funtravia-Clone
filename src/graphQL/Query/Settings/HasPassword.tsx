import { gql } from "apollo-boost";
const hasPassword = gql`
  query {
    cek_haspassword {
      ishasPassword
      user_id
    }
  }
`;

export default hasPassword;
