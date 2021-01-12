import { gql } from 'apollo-boost';
const CreateSetting = gql`
	mutation(
		$countries_id: ID!
		$currency_id: ID!
		$aktivasi_akun: Boolean!
		$price_notif: Boolean!
		$status_order_and_payment: Boolean!
		$hotels_and_flight_info: Boolean!
		$funtravia_promo: Boolean!
		$review_response: Boolean!
		$payment_remender: Boolean!
	) {
		create_settings(
			input: {
				countries_id: $countries_id
				currency_id: $currency_id
				aktivasi_akun: $aktivasi_akun
				price_notif: $price_notif
				status_order_and_payment: $status_order_and_payment
				hotels_and_flight_info: $hotels_and_flight_info
				funtravia_promo: $funtravia_promo
				review_response: $review_response
				payment_remender: $payment_remender
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default CreateSetting;
