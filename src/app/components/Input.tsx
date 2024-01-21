import React from "react";

function Input({
  id,
  label,
  type,
  controller,
  errorMessage,
  value,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  controller: React.Dispatch<React.SetStateAction<string>>; // State
  errorMessage?: string;
  value: any;
  autoComplete?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-1 py-2 pr-2">
        <label htmlFor={id} className="label label-text">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={id}
          className="input input-info sm:input-lg input-md"
          value={value}
          onChange={(e) => controller(e.currentTarget.value)}
          autoComplete={autoComplete}
        />
        <small className={errorMessage ? "text text-error pt-1" : "hidden"}>
          {errorMessage}
        </small>
      </div>
    </>
  );
}

export default Input;
