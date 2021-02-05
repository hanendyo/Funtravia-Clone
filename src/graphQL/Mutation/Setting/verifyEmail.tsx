import { gql } from "apollo-boost";

const verifyEmail = gql`
  mutation($newEmail: String!, $otp: Int!) {
    change_email_verification(
      new_email: $newEmail
      otp_code: $otp
    ) {
      new_email
      response_time
      message
      code
    }
  }
`;
export default verifyEmail;
