import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="relative h-screen w-full pt-16 overflow-hidden flex flex-col items-center justify-center text-center bg-white">

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/40 via-blue-500/20 to-white" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6">

        <p className="text-sm md:text-base font-extrabold tracking-[0.10em] uppercase text-black">
          D-Link Real Estate · D-Link Colombo
        </p>

        <h1 className="playfair text-[8rem] md:text-[11rem] font-bold text-gray-800 leading-none">
          404
        </h1>

        <div className="w-12 h-[3px] rounded-full bg-blue-500" />

        <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
          Page Not Found
        </h2>

        <p className="text-sm text-gray-800 max-w-sm leading-relaxed">
          Looks like this listing doesn&apos;t exist on our site. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="select-none btn-primary-base btn-dynamic mt-4"
        >
          BACK TO HOME <TbArrowRight size={20} />
        </Link>

      </div>
    </div>
  );
}
