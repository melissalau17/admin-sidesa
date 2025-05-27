import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-85 max-w-sm md:max-w-lg flex flex-col gap-1">
        {label && (
          <label className="text-sm md:text-base font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2
            text-sm md:text-base
            border rounded-md
            focus:ring-2 focus:ring-[#004D40] focus:outline-none
            disabled:opacity-50
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
