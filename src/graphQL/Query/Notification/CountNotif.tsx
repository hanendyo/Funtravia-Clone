import { gql } from 'apollo-boost';
const CountNotif = gql`
	query {
		count_notif {
			count
		}
	}
`;
export default CountNotif;
