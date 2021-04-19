import { gql } from "apollo-boost";
const BerandaPopuler = gql`
  query {
    beranda_popularV2(limit: 7) {
      id
      name
      cover
      count_destination
      count_plan_tour
      image {
        image
      }
    }
  }
`;
export default BerandaPopuler;
