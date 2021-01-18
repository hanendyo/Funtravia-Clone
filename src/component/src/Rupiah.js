export const rupiah = (nilai) => {
	let number_string = typeof nilai == 'number' ? nilai.toString() : nilai,
		sisa = number_string.length % 3,
		jumlah = number_string.substr(0, sisa),
		ribuan = number_string.substr(sisa).match(/\d{3}/g);

	if (ribuan) {
		let separator = sisa ? '.' : '';
		jumlah += separator + ribuan.join('.');
	}

	return jumlah;
};
