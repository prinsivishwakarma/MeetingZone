import { EuiFlexGroup, EuiForm, EuiSpacer } from "@elastic/eui";
import { addDoc } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import CreateMeetingButtons from "../components/FormComponents/CreateMeetingButtons";
import MeetingDateField from "../components/FormComponents/MeetingDateField";
import MeetingNameField from "../components/FormComponents/MeetingNameFIeld";
import MeetingUserField from "../components/FormComponents/MeetingUserField";

import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import useToast from "../hooks/useToast";
import { meetingsRef } from "../utils/firebaseConfig";
import { generateMeetingID } from "../utils/generateMeetingId";
import { FieldErrorType, UserType } from "../utils/types";

export default function OneOnOneMeeting() {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();
  const uid = useAppSelector((zoomApp) => zoomApp.auth.userInfo?.uid);
  const navigate = useNavigate();

  const [meetingName, setMeetingName] = useState("");
  const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]); // Only one user for 1-on-1 meeting
  // For email invite
  const [customEmailOptions, setCustomEmailOptions] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [showErrors, setShowErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });

  // When user is selected from dropdown
const onUserChange = (selectedOptions: Array<UserType | { label: string; email: string; uid: string }>) => {
  setSelectedUser(selectedOptions as Array<UserType>);
};

// Allow user to invite by email
const onCreateEmailOption = (searchValue: string) => {
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(searchValue)) {
    createToast({
      title: "Invalid email address",
      type: "danger",
    });
    return;
  }
  // Prevent duplicate invites
  const exists = [...selectedUser, ...customEmailOptions].some(
    (user) => user.email === searchValue || user.uid === searchValue
  );
  if (exists) {
    createToast({
      title: "User already invited",
      type: "warning",
    });
    return;
  }
  const newOption = { label: searchValue, email: searchValue, uid: searchValue } as UserType;
  setCustomEmailOptions([...customEmailOptions, newOption]);
  setSelectedUser([...selectedUser, newOption]);
};

  const validateForm = () => {
    const showErrorsClone = { ...showErrors };
    let errors = false;
    // Meeting name validation
    if (!meetingName.length) {
      showErrorsClone.meetingName.show = true;
      showErrorsClone.meetingName.message = ["Please Enter Meeting Name"];
      errors = true;
    } else {
      showErrorsClone.meetingName.show = false;
      showErrorsClone.meetingName.message = [];
    }
    // User selection validation
    if (!selectedUser.length) {
      showErrorsClone.meetingUser.show = true;
      showErrorsClone.meetingUser.message = ["Please Select a User"];
      errors = true;
    } else {
      showErrorsClone.meetingUser.show = false;
      showErrorsClone.meetingUser.message = [];
    }
    // Prevent inviting self
    if (selectedUser.length && (selectedUser[0]?.uid === uid || selectedUser[0]?.email === uid)) {
      createToast({
        title: "You cannot invite yourself to a 1-on-1 meeting.",
        type: "danger",
      });
      showErrorsClone.meetingUser.show = true;
      showErrorsClone.meetingUser.message = ["You cannot invite yourself."];
      errors = true;
    }
    // Prevent past date
    if (startDate.isBefore(moment().startOf('day'), 'day')) {
      createToast({
        title: "Meeting date cannot be in the past.",
        type: "danger",
      });
      errors = true;
    }
    setShowErrors(showErrorsClone);
    return errors;
  };

  // Create meeting and set invited user in Firestore
const createMeeting = async () => {
  if (!validateForm()) {
    const meetingId = generateMeetingID();
    await addDoc(meetingsRef, {
      createdBy: uid,
      meetingId,
      meetingName,
      meetingType: "1-on-1",
      invitedUsers: [selectedUser[0]?.uid || selectedUser[0]?.email], // Support email or user UID
      meetingDate: startDate.format("L"),
      maxUsers: 1,
      status: true,
    });
    createToast({
      title: "One on One Meeting Created Successfully",
      type: "success",
    });
    navigate("/");
  }
};

  // Debug log to inspect dropdown options
  console.log("Dropdown options:", [...users, ...customEmailOptions]);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Header />
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiForm>
          <div style={{ maxWidth: 420, margin: '64px auto 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 32 }}>
  <EuiForm>
    <MeetingNameField
      label={<span style={{ fontWeight: 700 }}>Meeting name</span>}
      isInvalid={showErrors.meetingName.show}
      error={showErrors.meetingName.message}
      placeholder="Meeting name"
      value={meetingName}
      setMeetingName={setMeetingName}
    />
    <EuiSpacer size="l" />
    {/* Invite User Dropdown - shows real users from Firebase */}
<MeetingUserField
  label={<span style={{ fontWeight: 700 }}>Invite User</span>}
  isInvalid={showErrors.meetingUser.show}
  error={showErrors.meetingUser.message}
  options={[...users, ...customEmailOptions]}
  onChange={onUserChange}
  selectedOptions={selectedUser}
  singleSelection={{ asPlainText: true }}
  isClearable={false}
  placeholder="Select a User or enter email"
  onCreateOption={onCreateEmailOption}
/>
    <EuiSpacer size="l" />
    <MeetingDateField 
  selected={startDate}
  setStartDate={setStartDate}
  label={<span style={{ fontWeight: 700 }}>Set Meeting Date</span>}
  showTimeSelect={true}
  minDate={moment()}
/>
    <EuiSpacer size="xl" />
    <CreateMeetingButtons createMeeting={createMeeting} />
  </EuiForm>
</div>
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}