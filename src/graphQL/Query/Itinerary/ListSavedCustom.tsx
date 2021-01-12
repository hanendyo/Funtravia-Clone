import { gql } from 'apollo-boost';
const ListSavedCustom = gql`
	query {
		saved_activity_list {
			id
			title
			note
			time
			icon
			qty
			duration
			address
			latitude
			longitude
			total_price
			images
		}
	}
`;
export default ListSavedCustom;
