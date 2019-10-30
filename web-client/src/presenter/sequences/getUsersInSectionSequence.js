import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { resetFormAssigneeIdAction } from '../actions/resetFormAssigneeIdAction';
import { setUsersAction } from '../actions/setUsersAction';

export const getUsersInSectionSequence = [
  resetFormAssigneeIdAction,
  getUsersInSelectedSectionAction,
  setUsersAction,
];
