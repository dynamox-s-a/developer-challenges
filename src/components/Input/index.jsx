import { memo, forwardRef } from 'react'

export const Input = memo(
  forwardRef(({ error, className, ...props }, ref) => {
    return (
      <div className="w-full max-w-20rem">
        <div
          className={`h-14 w-full flex bg-[#fff] p-3 rounded-md ${
            error && 'border-danger border-1'
          } ${className}`}
        >
          <input
            className="outline-[0px] flex-grow font-epilogue"
            type="text"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    )
  }),
)
