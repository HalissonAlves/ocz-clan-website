import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#060806]">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/assets/ocz_brasao.png"
              alt=""
              width={44}
              height={44}
              className="size-11 object-contain"
            />
            <span className="font-display text-xl font-bold tracking-[0.12em]">
              OCZ CLAN
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-500">
            Uma vitrine das disputas, conquistas e histórias de três caçadores
            em The Hunter: Call of the Wild.
          </p>
        </div>
        <div className="text-left text-xs leading-6 text-stone-600 sm:text-right">
          <p>Pardal · Bode · Black Apple</p>
          <p>Feito para a próxima caçada.</p>
        </div>
      </div>
    </footer>
  );
}
