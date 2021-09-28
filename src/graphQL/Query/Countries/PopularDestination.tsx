import { gql } from "apollo-boost";
const RegionList_v2 = gql`
  query($keyword: String, $type: [ID]) {
    populer_city_destination_v2(key: { keyword: $keyword, type: $type }) {
      id
      name
      count_destination
      image {
        image
      }
      city{
        id
        name
        cover
        head1
        head2
        latitude
        longitude
        count_destination
        count_plan_tour
        type
        description_type
      }
    }
  }
`;
export default RegionList_v2;
