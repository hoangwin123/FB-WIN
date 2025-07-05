import React, { useState } from 'react';
import useFormValidation from '@hooks/useFormValidation';
import { useOutletContext } from 'react-router-dom';

type FieldName = 'email';

type ContextType = {
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	emailInputRef: React.RefObject<HTMLInputElement>;
};

const LoginForm: React.FC = () => {
	const [formData, setFormData] = useState<{ email: string }>({ email: '' });
	const { errors, validateInput } = useFormValidation();
	const { setEmail, emailInputRef } = useOutletContext<ContextType>();

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		field: FieldName
	) => {
		const value = event.target.value;
		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
		if (field === 'email') setEmail(value);
		validateInput(field, value);
	};

	return (
		<div className="max-w-md mx-auto my-6 bg-white p-6 rounded-2xl shadow-sm">
			<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
				Account Verification
			</h2>

			<div className="mb-4">
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
					Email Address
				</label>
				<input
					ref={emailInputRef}
					id="email"
					type="email"
					placeholder="you@example.com"
					value={formData.email}
					onChange={(e) => handleInputChange(e, 'email')}
					onBlur={() => validateInput('email', formData.email)}
					className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
				/>
				{errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
			</div>

			<button
				type="submit"
				className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
			>
				Continue
			</button>
		</div>
	);
};

export default LoginForm;
