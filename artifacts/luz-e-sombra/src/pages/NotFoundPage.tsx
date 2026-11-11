import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function NotFoundPage() {
  return (
    <PublicShell
      pagePath="/404"
      pageTitle={`Página não encontrada | ${SITE_NAME}`}
      pageDescription="Esta página não existe ou foi movida."
    >
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold">Página não encontrada</h1>
        <p className="mt-4 text-[rgba(247,242,236,0.7)]">
          O endereço pode ter mudado. Volte ao início ou explore a biblioteca.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-md bg-[#c8a56b] px-4 py-2 text-[#1e1812]">
            Ir para o início
          </Link>
          <Link href="/blog" className="rounded-md border border-[rgba(200,165,107,0.35)] px-4 py-2 text-[#c8a56b]">
            Biblioteca
          </Link>
          <Link href="/login" className="rounded-md border border-[rgba(200,165,107,0.35)] px-4 py-2 text-[#c8a56b]">
            Entrar
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
