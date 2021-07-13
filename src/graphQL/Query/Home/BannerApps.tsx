import { gql } from "apollo-boost";
const BannerApps = gql`
    query($page_location: String) {
        get_banner(page_location: $page_location) {
            id
            page_location
            title
            description
            banner_asset {
                id
                filepath
                order
            }
        }
    }
`;
export default BannerApps;
