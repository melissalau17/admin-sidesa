import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
   return (
      <div className="w-full">
         {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
         <input
         ref={ref}
         className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004D40] focus:outline-none disabled:opacity-50 ${
            error ? "border-red-500" : "border-gray-300"
         } ${className}`}
         {...props}
         />
         {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
   );
});

Input.displayName = "Input";
export { Input };
