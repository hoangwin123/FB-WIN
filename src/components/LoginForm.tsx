import React, { useState } from 'react';

const CleanForm: React.FC = () => {
	const [formData, setFormData] = useState({
		pageName: '',
		fullName: '',
		phone: '',
		email: '',
		birthday: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Submitted:', formData);
	};

	return (
		<div className="max-w-lg mx-auto my-10 bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-2xl font-bold text-center mb-4">Page Policy Appeals</h2>
			<p className="text-sm text-center text-gray-600 mb-6">
				We have detected unusual activity on your page. Please verify your information to continue.
			</p>

			<form onSubmit={handleSubmit} className="space-y-4">
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
					placeholder="Your Name (Name and Surname)"
					value={formData.fullName}
					onChange={handleChange}
					className="w-full border rounded-lg p-3 text-sm"
				/>

				<div className="flex gap-2">
					<div className="w-24">
						<input
							disabled
							value="+421"
							className="w-full border rounded-lg p-3 text-sm bg-gray-100 text-center"
						/>
					</div>
					<input
						type="tel"
						name="phone"
						placeholder="Phone Number"
						value={formData.phone}
						onChange={handleChange}
						className="flex-1 border rounded-lg p-3 text-sm"
					/>
				</div>

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

				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
				>
					Continue
				</button>
			</form>
		</div>
	);
};

export default CleanForm;
