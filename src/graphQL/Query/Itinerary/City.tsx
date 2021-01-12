import { gql } from 'apollo-boost';
const City = gql`
	query($keyword: String, $countries_id: ID!) {
		cities_search(key: { keyword: $keyword, countries_id: $countries_id }) {
			id
			name
			code
			latitude
			longitude
			description
			countries {
				id
				name
				flag
			}
			map
			cover {
				image
			}
			images {
				image
			}
		}
	}
`;
export default City;
