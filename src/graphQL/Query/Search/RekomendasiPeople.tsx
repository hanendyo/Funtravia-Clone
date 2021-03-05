import { gql } from "apollo-boost";
const RekomendasiPeople = gql`
  query {
    list_rekomendasi_user(limit: 5) {
      id
      username
      first_name
      last_name
      picture
      bio
      status_follower
      status_following
    }
  }
`;
export default RekomendasiPeople;
