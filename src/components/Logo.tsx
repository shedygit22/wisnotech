import ImageWithFallback from "./ImageWithFallback";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <ImageWithFallback
        src="/assets/wisnotech-logo.png"
        alt="Wisnotech logo"
        loading="eager"
        className="h-7 w-auto object-contain sm:h-8"
        fallback={
          <span className="flex h-8 items-center justify-center rounded-lg bg-white px-2 font-bold text-sm text-[#080808]">
            W
          </span>
        }
      />
      <span className="text-[17px] font-semibold tracking-tight text-white">
        WISNOTECH
      </span>
    </span>
  );
}