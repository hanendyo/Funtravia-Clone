import { gql } from "apollo-boost";
const genderSettingAkun = gql`
  mutation($date: String!) {
    update_birth_settings(birth_date: $date) {
      id
      response_time
      message
      code
    }
  }
`;
export default genderSettingAkun;
