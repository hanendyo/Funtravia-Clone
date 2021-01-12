import { gql } from 'apollo-boost';
const CategoryEvent = gql`
	query {
		event_type {
			id
			name
			sugestion
			checked
			show
		}
	}
`;
export default CategoryEvent;
