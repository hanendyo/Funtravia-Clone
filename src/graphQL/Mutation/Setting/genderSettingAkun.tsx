import { gql } from "apollo-boost";
const genderSettingAkun = gql`
  mutation($gender: String!) {
    update_gender_settings(gender: $gender) {
      id
      response_time
      message
      code
    }
  }
`;
export default genderSettingAkun;
