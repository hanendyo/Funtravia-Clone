import { gql } from 'apollo-boost';
const package_list = gql`
	query($countries_id: ID!) {
		country_package(countries_id: $countries_id) {
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
			rating
			count_review
		}
	}
`;
export default package_list;
