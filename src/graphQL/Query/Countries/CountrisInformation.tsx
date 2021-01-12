import { gql } from 'apollo-boost';
const CountriesInformation = gql`
	query($id: ID!) {
		country_detail(id: $id) {
			id
			name
			code
			description
			flag
			images {
				image
			}
			map
			city {
				id
				name
				image {
					image
				}
			}
		}
	}
`;
export default CountriesInformation;
