import React from "react";
import { EuiFormRow, EuiDatePicker } from "@elastic/eui";
import moment, { Moment } from "moment";

// Custom styles for calendar popover and input
const calendarStyles = `
.custom-calendar-popover .euiDatePicker__popover {
  border-radius: 12px !important;
  border: 2px solid red !important; /* DEBUG: show popover border */
  background: #fff !important;
  z-index: 9999 !important;
}
.custom-calendar .euiFieldText {
  border-radius: 12px !important;
  font-size: 1.15rem !important;
  padding: 14px 16px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 2px solid #e2e8f0;
  height: 52px;
}
.custom-calendar .euiFormControlLayout__icon {
  color: #606060;
  min-width: 22px;

}
`;


type MeetingDateFieldProps = {
  selected: Moment;
  setStartDate: React.Dispatch<React.SetStateAction<Moment>>;
  label?: React.ReactNode;
  showTimeSelect?: boolean;
  minDate?: Moment;
  maxDate?: Moment;
  dateFormat?: string;
};

const MeetingDateField: React.FC<MeetingDateFieldProps> = ({
  selected,
  setStartDate,
  label,
  showTimeSelect = false,
  minDate = moment().startOf('day'),
  maxDate,
  dateFormat = "L",
}) => (
  <>
    {console.log('MeetingDateField rendered')}
    <EuiFormRow label={label ?? "Meeting Date"} style={{ marginBottom: 18 }}>
      <EuiDatePicker
        selected={selected}
        onChange={date => date && setStartDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        dateFormat={dateFormat}
        placeholder="Select date and time"
        fullWidth
        showIcon={true}
        iconType="calendar"
        popoverPlacement="downCenter"
        aria-label="Select meeting date"
      />
    </EuiFormRow>
  </>
);

export default MeetingDateField;
