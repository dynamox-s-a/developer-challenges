import { memo } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

export const Button = memo(
  ({
    type = 'button',
    isLoading = false,
    children,
    className,
    classNameText,
    disabled = false,
    ...rest
  }) => {
    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        className={`
        h-14
        border-1
        w-full
        max-w-20rem
        flex p-3
        rounded-md
        flex
        justify-center
        items-center
        bg-[#44142d]
        hover:bg-[#00091C]
        text-white
        transition
        font-epilogue
        duration-300
        disabled:bg-[#D6D6DC]
        disabled:cursor-not-allowed
        disabled:text-[#AEAEBA]
        ${className}
      `}
        data-testid="button"
        {...rest}
      >
        <p className={`text-base font-epilogue ${classNameText}`}>
          {isLoading ? (
            <AiOutlineLoading className="animate-spin" size={20} />
          ) : (
            children
          )}
        </p>
      </button>
    )
  },
)
