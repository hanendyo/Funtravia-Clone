import { gql } from "apollo-boost";
const RegionList_v2 = gql`
  query($keyword: String, $type: [ID]) {
    populer_city_destination_v2(key: { keyword: $keyword, type: $type }) {
      id
      name
      image {
        image
      }
      cover
      city {
        id
        name
        cover
        latitude
        longitude
        count_plan_tour
        count_destination
        type
      }
    }
  }
`;
export default RegionList_v2;
