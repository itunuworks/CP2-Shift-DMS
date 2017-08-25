import actionTypes from '../actions/actionTypes';
import { usersDefaultState } from '../reducers/initialStates';

/**
 * @function users
 *
 * @param {any} [state = initialState]
 * @param {any} action
 * @returns {object} state
 */
function users(state = usersDefaultState, action) {
  switch (action.type) {
  case actionTypes.LOGOUT_REQUEST:
  case actionTypes.SIGNUP_REQUEST:
  case actionTypes.LOGIN_REQUEST:
  case actionTypes.LOGOUT_SUCCESSFUL:
  case actionTypes.SIGNUP_SUCCESSFUL:
  case actionTypes.LOGIN_SUCCESSFUL:
    return {
      ...state,
      currentUserErrorMessage: '',
      result: action.type
    };
  case actionTypes.LOGOUT_FAILED:
  case actionTypes.SIGNUP_FAILED:
  case actionTypes.LOGIN_FAILED:
    return {
      ...state,
      currentUserErrorMessage: action.payload,
      result: action.type
    };
  case actionTypes.REMOVE_USER:
    return {
      ...state,
      ...state,
      id: null,
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      role: '',
      result: action.type,
      isAuthenticated: false,
      currentUserUpdated: false,
      currentUserErrorMessage: ''
    };
  case actionTypes.ADD_USER:
    return {
      ...state,
      id: action.payload.id,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      roleId: action.payload.roleId,
      role: action.payload.role,
      result: action.type,
      isAuthenticated: true,
      currentUserUpdated: false,
      currentUserErrorMessage: ''
    };
  case actionTypes.FETCH_USERS_REQUEST:
    return {
      ...state,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      usersUpdating: true,
      currentUserErrorMessage: ''
    };
  case actionTypes.FETCH_USERS_SUCCESSFUL:
    return {
      ...state,
      users: action.payload,
      usersUpdated: true,
      usersUpdating: false,
    };
  case actionTypes.FETCH_USERS_FAILED:
    return {
      ...state,
      usersUpdated: false,
      usersUpdating: false,
      currentUserErrorMessage: action.payload
    };
  case actionTypes.USER_MODIFY_REQUEST:
    return {
      ...state,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      userDeleted: false,
      currentUserModifying: true,
      currentUserErrorMessage: ''
    };
  case actionTypes.USER_MODIFY_SUCCESSFUL:
    return {
      ...state,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      currentUser: action.payload,
      currentUserErrorMessage: '',
      currentUserModified: true,
      currentUserUpdated: true,
      currentUserModifying: false,
    };
  case actionTypes.USER_MODIFY_FAILED:
    return {
      ...state,
      currentUserModified: false,
      currentUserModifying: false,
      currentUserErrorMessage: action.payload
    };
  case actionTypes.USER_GET_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      currentUserUpdating: true,
      currentUserErrorMessage: ''
    };
  case actionTypes.USER_GET_SUCCESSFUL:
    return {
      ...state,
      currentUser: action.payload,
      currentUserUpdated: true,
      currentUserUpdating: false,
    };
  case actionTypes.USER_GET_FAILED:
    return {
      ...state,
      currentUserUpdated: false,
      currentUserUpdating: false,
      currentUserErrorMessage: action.payload
    };
  case actionTypes.USER_DELETE_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      userDeleting: true,
      currentUserErrorMessage: ''
    };
  case actionTypes.USER_DELETE_SUCCESSFUL:
    return {
      ...state,
      userDeleted: true,
      userDeleting: false,
    };
  case actionTypes.USER_DELETE_FAILED:
    return {
      ...state,
      userDeleted: false,
      userDeleting: false,
      currentUserErrorMessage: action.payload
    };
  case actionTypes.FETCH_ROLES_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      userDeleted: false,
      updatingRoles: true,
      currentUserErrorMessage: ''
    };
  case actionTypes.FETCH_ROLES_SUCCESSFUL:
    return {
      ...state,
      rolesUpdated: true,
      roles: action.payload
    };
  case actionTypes.FETCH_ROLES_FAILED:
    return {
      ...state,
      rolesUpdated: false,
      updatingRoles: false,
      currentUserErrorMessage: action.payload
    };
  case actionTypes.USER_CANCELLED:
    return {
      ...state,
      currentUserUpdated: false,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      userDeleted: false,
      currentUserErrorMessage: ''
    };
  default:
    return state;
  }
}

export default users;
