import { gql } from 'apollo-boost';
const CountryList = gql`
	query {
		country_list {
			id
			name
			code
			description
			flag
			map
			created_by
			updated_by
			created_at
			updated_at
			currency {
				id
				name
				code
			}
			images {
				image
			}
		}
	}
`;
export default CountryList;
