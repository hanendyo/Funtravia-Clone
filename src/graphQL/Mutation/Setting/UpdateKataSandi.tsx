import { gql } from "apollo-boost";
const UpdateKataSandi = gql`
  mutation($oldPass: String!, $newPass: String!) {
    change_password_settings(oldpassword: $oldPass, newpassword: $newPass) {
      id
      response_time
      message
      code
    }
  }
`;

export default UpdateKataSandi;
