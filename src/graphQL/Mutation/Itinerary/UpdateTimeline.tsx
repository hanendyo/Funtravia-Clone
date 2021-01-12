import { gql } from 'apollo-boost';
const UpdateTimeline = gql`
	mutation($idday: ID!, $value: String!) {
		update_timeline(
			input: {
				day_id: $idday
				value: $value
				# "[{"id":"017af972-6248-4461-ae86-5011831be16b","type":"destination","name":"Pangandaran","time":"11:00:00","note":null,"order":"2","duration":"01:00","address":"Pangandaran, Pananjung, Pangandaran, Ciamis Regency, West Java, Indonesia","latitude":"-7.683332999999999","longitude":"108.65","total_price":null,"city":"Bandung","images":"https://fa12.funtravia.com/destination/20200814/IfvKw_ca1657c4-306c-45b1-aa0b-4e7edd236d8f","status":false,"__typename":"AllActivity"},{"id":"cc18ff63-b5cb-4ab5-8026-bafb80a62d08","type":"destination","name":"Pangandaran","time":"12:00","note":null,"order":"3","duration":"02:00","address":"Pangandaran, Pananjung, Pangandaran, Ciamis Regency, West Java, Indonesia","latitude":"-7.683332999999999","longitude":"108.65","total_price":null,"city":"Bandung","images":"https://fa12.funtravia.com/destination/20200814/IfvKw_ca1657c4-306c-45b1-aa0b-4e7edd236d8f","status":false,"__typename":"AllActivity"},{"id":"cd34ff2f-7f12-4a50-b3a3-637a43cfa34e","type":"google","name":"malioboro","time":"14:00","note":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,","order":"4","duration":"01:00:00","address":"Yogyakarta","latitude":"-7.683332999999999","longitude":"108.65","total_price":"100000","city":"Bandung","images":null,"status":true,"__typename":"AllActivity"}]"
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default UpdateTimeline;
