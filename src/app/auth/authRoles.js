/**
 * Authorization Roles
 */
const authRoles = {
  admin: ["admin"],
  wholeseller: ["admin", "wholeseller"],
  staff: ["admin", "staff"],
  user: ["admin", "staff", "user"],
  onlyGuest: [],
};

export default authRoles;
