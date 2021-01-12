import { gql } from 'apollo-boost';
const Timeline = gql`
	query($id: ID!) {
		day_timeline(day_id: $id) {
			id
			type
			name
			time
			note
			order
			duration
			address
			latitude
			longitude
			total_price
			city
			images
			status
			icon
		}
	}
`;
export default Timeline;
