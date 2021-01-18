import { gql } from 'apollo-boost';
const FilterEvent = gql`
	query {
		event_filter {
			type {
				id
				name
				sugestion
				checked
				show
			}
			country {
				id
				name
				flag
				code
				sugestion
				checked
				show
			}
		}
	}
`;
export default FilterEvent;
