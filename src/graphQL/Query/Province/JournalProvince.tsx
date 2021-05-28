import { gql } from "apollo-boost";
const ProvinceJournal = gql`
    query($id: ID!) {
        journal_by_province(province_id: $id) {
            id
            title
            text
            picture
            userby {
                id
                username
                first_name
                last_name
                picture
            }
            liked
        }
    }
`;
export default ProvinceJournal;
