import React from 'react'
import { useForm } from 'react-hook-form';

const Form = ({ formFields }) => {

  const { register, handleSubmit, formState: { errors} } = useForm();
  const onSubmit = data => alert(JSON.stringify(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col w-full items-center justify-center gap-3'
    >
    {
      formFields.map((input, index) => (
        <input 
          className='w-[27rem] px-4 text-center py-3 rounded-md bg-white text-black-description placeholder-black-description text-base leading-5'
          key={index} 
          placeholder={input.placeholder}
          {...register(input.name, { required: input.required })}
        />
      ))
    }

      <input 
        className='bg-[#0165DB] py-2 px-14 mt-6 rounded-md font-bold text-xl leading-6 cursor-pointer'
        type="submit" 
        value="ENVIAR" 
      />
    </form>
  )
}

export default Form