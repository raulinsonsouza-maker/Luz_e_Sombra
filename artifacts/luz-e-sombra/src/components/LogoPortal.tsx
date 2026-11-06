import { LOGO_CLARO, LOGO_OURO } from "@/lib/marca";

type Props = {
  /** Claro no fundo escuro. Ouro no fundo claro. */
  tom?: "claro" | "ouro";
  className?: string;
};

export default function LogoPortal({ tom = "claro", className = "h-10 w-auto" }: Props) {
  return (
    <img
      src={tom === "ouro" ? LOGO_OURO : LOGO_CLARO}
      alt="Portal Iluminando"
      className={className}
    />
  );
}
