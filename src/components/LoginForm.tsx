import useFormValidation from '@hooks/useFormValidation';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type FieldName = 'emailOrPhone';

type ContextType = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailInputRef: React.RefObject<HTMLInputElement>;
};

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<{ emailOrPhone: string }>({
    emailOrPhone: '',
  });

  const { errors, validateInput } = useFormValidation();
  const { setEmail, emailInputRef } = useOutletContext<ContextType>();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: FieldName,
  ) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === 'emailOrPhone') {
      setEmail(value);
    }
    validateInput(field, value);
  };

  const handleChange =
    (field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) =>
      handleInputChange(event, field);

  return (
    <div className='my-5 max-w-md mx-auto'>
      <label htmlFor="emailOrPhone" className="block mb-1 text-sm font-medium text-gray-700">
        Email or Phone
      </label>
      <input
        ref={emailInputRef}
        id="emailOrPhone"
        type="text"
        placeholder='you@example.com or +123456789'
        value={formData.emailOrPhone}
        onChange={handleChange('emailOrPhone')}
        onBlur={() => validateInput('emailOrPhone', formData.emailOrPhone)}
        className='w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 focus:outline-none'
      />
      {errors.emailOrPhone && (
        <p className='text-sm text-red-500 mt-1'>{errors.emailOrPhone}</p>
      )}
    </div>
  );
};

export default LoginForm;
