import { gql } from 'apollo-boost';
const Continent = gql`
    query{
        continent_type{
            id
            name
            sugestion
            checked
            show
        }
    }
`;
export default Continent;
