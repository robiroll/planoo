import { createElement } from 'react'

interface InputProps {
  id: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
}

export const Input: React.FunctionComponent<InputProps> = ({
  value,
  onChange,
  id,
  label,
  placeholder = '',
  type = 'text',
  required = false,
}) => {
  return (
    <>
      <label htmlFor={id} className="block text-white-700 font-bold mb-2">
        {label}
      </label>

      {createElement(type === 'textarea' ? 'textarea' : 'input', {
        className: 'bg-purple-100 py-2 px-3 w-full bg-opacity-10 border-b-4 border-purple-500',
        id,
        type,
        placeholder,
        value,
        onChange,
        required,
      })}
    </>
  )
}
