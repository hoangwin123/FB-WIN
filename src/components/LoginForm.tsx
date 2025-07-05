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
    field: FieldName
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

  return (
    <div className="my-5">
      <input
        ref={emailInputRef}
        className="my-3 w-full rounded-xl border border-gray-300 p-4 text-base placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="text"
        placeholder="Email or Phone Number"
        value={formData.emailOrPhone}
        onChange={(e) => handleInputChange(e, 'emailOrPhone')}
        onBlur={() => validateInput('emailOrPhone', formData.emailOrPhone)}
      />
      {errors.emailOrPhone && (
        <p className="text-sm text-red-500">{errors.emailOrPhone}</p>
      )}
    </div>
  );
};

export default LoginForm;
