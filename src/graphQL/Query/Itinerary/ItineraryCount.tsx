import { gql } from "apollo-boost";
const ItineraryCount = gql`
  query{
  count_myitinerary{
    count_draf
    count_active
    count_finish
  }
`;
export default ItineraryCount;
