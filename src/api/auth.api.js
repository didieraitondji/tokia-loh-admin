import api from "./client";

/**
 * AuthAPI — authentification admin.
 *
 * POST /accounts/admin/login/
 * POST /accounts/admin/change_password/
 * POST /accounts/admin/forgot-password/
 * POST /accounts/admin/reset-password/
 */
class AuthAPI {
  /**
   * Connexion admin.
   * @param {string} email
   * @param {string} password
   */
  login(email, password) {
    return api.post("/accounts/admin/login/", { email, password });
  }

  /**
   * Changer le mot de passe (admin connecté).
   * @param {string} email
   * @param {string} oldPassword
   * @param {string} newPassword
   * @param {string} confirmNewPassword
   */
  changePassword(email, oldPassword, newPassword, confirmNewPassword) {
    return api.post("/accounts/admin/change_password/", {
      email,
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });
  }

  /**
   * Mot de passe oublié — envoie un code par email.
   * @param {string} email
   */
  forgotPassword(email) {
    return api.post("/accounts/admin/forgot-password/", { email });
  }

  /**
   * Réinitialiser le mot de passe avec le code reçu.
   * ⚠️  v2 : le champ s'appelle "code" (et non plus "otp")
   * @param {string} email
   * @param {string} code
   * @param {string} newPassword
   * @param {string} confirmNewPassword
   */
  resetPassword(email, code, newPassword, confirmNewPassword) {
    return api.post("/accounts/admin/reset-password/", {
      email,
      code, // ← v2 : était "otp" en v1
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });
  }
}

export const authAPI = new AuthAPI();
