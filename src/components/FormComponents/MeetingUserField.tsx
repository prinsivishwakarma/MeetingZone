import { EuiComboBox, EuiFormRow } from "@elastic/eui";
import React from "react";

interface UserOption {
  label?: string;
  name?: string;
  email?: string;
  uid?: string;
  [key: string]: any;
}

function MeetingUserField({
  label,
  isInvalid,
  error,
  options,
  onChange,
  selectedOptions,
  singleSelection = false,
  isClearable,
  placeholder,
  onCreateOption,
}: {
  label: React.ReactNode;
  isInvalid: boolean;
  error: Array<string>;
  options: any;
  onChange: any;
  selectedOptions: any;
  singleSelection?: { asPlainText: boolean } | boolean;
  isClearable: boolean;
  placeholder: string;
  onCreateOption?: (searchValue: string) => void;
}) {
  // Debug: log the options prop to see if users are being passed in
  console.log("MeetingUserField options:", options);
  return (
    <EuiFormRow label={label} isInvalid={isInvalid} error={error}>
      {options && options.length > 0 ? (
        <EuiComboBox
          fullWidth
          style={{ minHeight: 40 }}
          options={options.map((option: UserOption) => ({
            ...option,
            label: option.name
              ? `${option.name}${option.email ? ' (' + option.email + ')' : ''}`
              : option.email || option.uid || '',
            key: option.uid || option.email || option.name || Math.random().toString(),
          }))}
          onChange={onChange}
          selectedOptions={selectedOptions.map((option: UserOption) => ({
            ...option,
            label: option.name
              ? `${option.name}${option.email ? ' (' + option.email + ')' : ''}`
              : option.email || option.uid || '',
            key: option.uid || option.email || option.name || Math.random().toString(),
          }))}
          singleSelection={singleSelection}
          isClearable={isClearable}
          placeholder={placeholder}
          isInvalid={isInvalid}
          onCreateOption={onCreateOption}
          onFocus={e => e.target.click()} // Open dropdown on focus
        />
      ) : (
        <div style={{ color: 'red', padding: 8 }}>No users available to invite.</div>
      )}
    </EuiFormRow>
  );
}

export default MeetingUserField;