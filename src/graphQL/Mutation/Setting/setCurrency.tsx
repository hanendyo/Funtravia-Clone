import { gql } from 'apollo-boost';
const setCurrency = gql`
	mutation($currency_id: ID!) {
		update_currency_settings(currency_id: $currency_id) {
			id
			response_time
			message
			code
		}
	}
`;
export default setCurrency;
