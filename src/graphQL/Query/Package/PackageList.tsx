import { gql } from 'apollo-boost';
const PackageList = gql`
    query ($keyword:String){
        package_list(key:{keyword:$keyword}){
        id
        name
        available
        price
        day
        night
        cover
        city{
            id
            name
        }
        vendor{
            id
            name
        }
        
        }
    }
`;
export default PackageList;