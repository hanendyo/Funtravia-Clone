import { gql } from 'apollo-boost';

const Logout = gql`
	mutation logout($token: String) {
		logout(token: $token) {
			status
			message
		}
	}
`;

export default Logout;
