export const PASSWORD_MIN_LENGTH = 8;

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function validatePassword(senha: string): string | null {
  if (senha.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!SPECIAL_CHAR_REGEX.test(senha)) {
    return "A senha deve conter pelo menos 1 caractere especial (!@#$%&*...).";
  }
  return null;
}

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, incluindo 1 caractere especial (!@#$%&*...).";
