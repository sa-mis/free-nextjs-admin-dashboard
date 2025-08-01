import React, { useState } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options?: Option[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  error?: boolean;
  children?: React.ReactNode;
  id?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
  defaultValue = "",
  error = false,
  children,
  id,
  disabled = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string | number>(value || defaultValue);

  // Update selectedValue when value prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    // Convert to number if the original value was a number
    const finalValue = typeof selectedValue === 'number' ? Number(newValue) : newValue;
    setSelectedValue(finalValue);
    onChange(finalValue); // Trigger parent handler
  };

  // Determine select styles based on state
  let selectClasses = `h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-700 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
    selectedValue
      ? "text-gray-800 dark:text-white"
      : "text-gray-400 dark:text-gray-400"
  } ${className}`;

  // Add styles for different states
  if (disabled) {
    selectClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    selectClasses += ` text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else {
    selectClasses += ` border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-600`;
  }

  return (
    <select
      id={id}
      className={selectClasses}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-700 dark:text-white"
      >
        {placeholder}
      </option>
      {/* Render options from props if provided */}
      {options && options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-700 dark:text-white"
        >
          {option.label}
        </option>
      ))}
      {/* Render children if provided */}
      {children}
    </select>
  );
};

export default Select;
