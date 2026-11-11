export const PASSWORD_MIN_LENGTH = 8;

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function validatePassword(senha: string): string | null {
  if (senha.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!SPECIAL_CHAR_REGEX.test(senha)) {
    return "Inclua pelo menos 1 caractere especial.";
  }
  return null;
}

export const PASSWORD_HINT = "Mínimo 8 caracteres, com 1 especial.";
