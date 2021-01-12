import { gql } from 'apollo-boost';
const setCountry = gql`
	mutation($countries_id: ID!) {
		update_country_settings(countries_id: $countries_id) {
			id
			response_time
			message
			code
		}
	}
`;
export default setCountry;
