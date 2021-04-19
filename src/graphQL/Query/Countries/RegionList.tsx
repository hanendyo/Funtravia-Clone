import { gql } from "apollo-boost";
const RegionList = gql`
  query($keyword: String, $type: [ID]) {
    populer_city_destination(key: { keyword: $keyword, type: $type }) {
      id
      name
      image {
        image
      }
      city {
        id
        name
        cover
        latitude
        longitude
        count_plan_tour
        count_destination
        image {
          image
        }
      }
    }
  }
`;
export default RegionList;
