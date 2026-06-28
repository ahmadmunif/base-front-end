import Password from "antd/es/input/Password";
import { fail } from "assert";
import { maxLength, success } from "zod";
import { de } from "zod/locales";
import { required } from "zod/mini";

export default {
  hello: "Hello",
  switchLanguage: "Switch Language",  
  logout: "Logout",
  login: {
    title: "telkomsigma",
    subTitle: "Login to management system",
    button: "Login",
    success: "Login successful",
    fail: "Login failed",
    form: {
      username: {
        placeholder: "Username",
        required: "Please enter your username!",
      },
      password: {
        placeholder: "Password",        
        required: "Please enter your password!",
      },
    },
  },
  userManagement: {
    user: {
      title: "User Management",
      resetButton: "Reset",
      saveButton: "Save",
      createButton: "Create New User",
      fail: "Create user failed",
      success: "Create user successful",
      editFail: "Update user failed",
      editSuccess: "Update user successful",
      deleteConfirm: "Are you sure to delete this user?",
      deleteSuccess: "User deleted successfully",
      deleteFail: "Failed to delete user",
      createNewUser: "Create New User",
      editUser: "Edit User",
      form : {
        username: {
          label: "Username",
          tooltip: "This is a required field and must be unique.",
          placeholder: "enter your username",
          required: "Username is required",
        },
        fullname: {
          label: "Full Name",
          placeholder: "enter your full name",
          required: "Please enter your full name",
        },
        email: {
          label: "Email",
          tooltip: "This is a required field and must be unique.",
          placeholder: "enter your email",
          required: "Please enter a valid email address",
        },
        password: {
          label: "Password",
          placeholder: "type your password",
          required: "Password is required",
          minLength: "Minimum 6 characters",
        },
        confirmPassword: {
          label: "Confirm Password",
          placeholder: "retype your password",
          required: "Please confirm your password",
          mismatch: "The two passwords that you entered do not match!",
        },
        status: {
          label: "Status",
          placeholder: "Select status",
          required: "Status is required",
        },
        roles: {
          label: "Roles",
          placeholder: "Select role",
          required: "Please select role",
        },
      },
    },
    role: {
      title: "Role Management",
      resetButton: "Reset",
      saveButton: "Save",
      createButton: "Create New Role",
      fail: "Create role failed",
      success: "Create role successful",
      editFail: "Update role failed",
      editSuccess: "Update role successful",
      deleteConfirm: "Are you sure to delete this role?",
      deleteSuccess: "Role deleted successfully",
      deleteFail: "Failed to delete role",
      createNewRole: "Create New Role",
      editUser: "Edit Role",
      form : {
        name: {
          label: "Role Name",
          tooltip: "This is a required field and must be unique.",
          placeholder: "enter role name",
          required: "Role name is required",
        },
        description: {
          label: "Description",
          placeholder: "enter role description",
          maxLength: "Description max length is 500 character",
        },  
        menu: {
          label: "Menu",
          placeholder: "Please select menu",
          required: "Menu is required",
        },      
      },
    },
    menu: {
      title: "Menu Management",
      resetButton: "Reset",
      saveButton: "Save",
      createButton: "Create New Menu",
      fail: "Create menu failed",
      success: "Create menu successful",
      editFail: "Update role failed",
      editSuccess: "Update menu successful",
      deleteConfirm: "Are you sure to delete this menu?",
      deleteSuccess: "Menu deleted successfully",
      deleteFail: "Failed to delete menu",
      createNewMenu: "Create New Menu",
      editUser: "Edit Menu",
      form: {
        name: {
          label: "Name",
          placeholder:"enter name",
          required: "Name is required",
        },
        path: {
          label: "Path",
          placeholder:"enter path",
          required: "Path is required",
        },
        icon: {
          label: "Icon",
          placeholder:"enter icon",
        },
        sortOrder: {
          label: "Sort Order",
          placeholder:"enter sort order",
        },
        parent: {
          label: "Parent Menu",
          placeholder:"select parent menu",
        },
        isActive: {
          label: "Status",
        },
      },
    },
  },
  showFilter: "Show Filter",
  hideFilter: "Hide Filter",
  find: "Find",
  clear: "Clear",
  showing: "Showing",
  of: "of",
  edit: "Edit",
  delete: "Delete",
};
