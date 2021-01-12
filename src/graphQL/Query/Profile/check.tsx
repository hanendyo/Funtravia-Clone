import { gql } from 'apollo-boost';
const check = gql`
	query($type: String!, $key: String!) {
		user_check(type: $type, key: $key) {
			isused
		}
	}
`;
export default check;
