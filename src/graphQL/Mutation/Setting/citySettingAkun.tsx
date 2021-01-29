import { gql } from "apollo-boost";
const citySettingAkun = gql`
  mutation($id: ID!) {
    update_city_settings(cities_id: $id) {
      id
      response_time
      message
      code
    }
  }
`;
export default citySettingAkun;
