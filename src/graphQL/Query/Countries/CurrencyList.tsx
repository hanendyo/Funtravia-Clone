import { gql } from 'apollo-boost';
const CurrencyList = gql`
	query {
		currency_list {
			id
			name
			code
			countries {
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
				images {
					image
				}
			}
		}
	}
`;
export default CurrencyList;
