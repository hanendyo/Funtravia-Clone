import { gql } from "apollo-boost";
const UpdatePassword = gql`
  mutation($password: String!) {
    update_password_settings(newpassword: $password) {
      id
      response_time
      message
      code
    }
  }
`;

export default UpdatePassword;
