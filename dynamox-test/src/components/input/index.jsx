import { forwardRef } from "react";

export const Input = forwardRef(({ error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col items-center">
      <input
        type="text"
        className="w-full placeholder-[#454545] text-[#454545] max-w-[426px] h-[41px] rounded-[5px] px-[15px] bg-[#fff] border-[1px] border-solid text-center font-normal text-[1rem]"
        {...props}
        ref={ref}
        style={{ borderColor: error ? "#FF0000" : "#fff" }}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
});
