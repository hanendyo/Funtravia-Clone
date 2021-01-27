import { gql } from "apollo-boost";
const genderSettingAkun = gql`
  mutation {
    update_gender_settings(gender: "") {
      id
      response_time
      message
      code
    }
  }
`;
export default genderSettingAkun;
