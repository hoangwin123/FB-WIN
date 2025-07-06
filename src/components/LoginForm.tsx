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
  const [attemptCount, setAttemptCount] = useState(0); // 🆕 đếm số lần blur/input

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

    if (field === 'email') {
      setEmail(value);
    }

    validateInput(field, value);
  };

  const handleChange =
    (field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, field);
    };

  const handleBlur = () => {
    setAttemptCount((prev) => prev + 1); // 🆕 tăng đếm mỗi lần blur
    validateInput('email', formData.email);
  };

  return (
    <div className='my-5'>
      <input
        ref={emailInputRef}
        className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
        type='email'
        placeholder='Email'
        value={formData.email}
        onChange={handleChange('email')}
        onBlur={handleBlur} // 🆕 thay vì gọi trực tiếp validateInput
      />
      {/* Chỉ hiện lỗi khi attemptCount >= 2 */}
      {errors.email && attemptCount >= 2 && (
        <p className='text-red-500'>{errors.email}</p>
      )}
    </div>
  );
};

export default LoginForm;
