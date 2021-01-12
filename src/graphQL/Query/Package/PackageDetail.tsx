import { gql } from 'apollo-boost';
const PackageList = gql`
query($id:ID!){
  package_detail(id: $id) {
    id
    name
    available
    price
    day
    night
    cover
    city {
      id
      name
    }
    vendor {
      id
      name
    }
    highlight {
      id
      value
    }
    include {
      id
      value
    }
    exclude {
      id
      value
    }
    itinerary {
      id
      day
      detail{
        id
        tittle
        description
        images{
          image
        }
      }
    }
  }
}
`;
export default PackageList;