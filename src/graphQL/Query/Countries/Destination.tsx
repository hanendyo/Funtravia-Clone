import { gql } from 'apollo-boost';
const Destination = gql`
	query($countries_id: ID!) {
		destinationList_country(countries_id: $countries_id) {
			id
			name
			destination {
				id
				name
				cities {
					id
					name
				}
				countries {
					id
					name
				}
				greatfor {
					label
					icon
				}
				images {
					image
				}
			}
		}
	}
`;
export default Destination;
