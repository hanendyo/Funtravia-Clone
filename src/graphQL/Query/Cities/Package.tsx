import { gql } from 'apollo-boost';
const package_list = gql`
	query($cities_id: ID!) {
		city_package(cities_id: $cities_id) {
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
