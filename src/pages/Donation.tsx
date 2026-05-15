import PlayerSlider from "@/features/donation/components/PlayerSlider";

export default function DonationPage() {
  return (
    <div className="min-h-[calc(100vh-61px)] bg-secondary">
      <div className="pt-8 pb-8 md:pt-12 md:pb-12 px-4 sm:px-6 md:px-10">
        <h2 className="text-primary text-base md:text-xl font-black italic tracking-widest mb-2">
          PLAYER SUPPORT
        </h2>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-tight">
          당신의 선수에게 <br className="sm:hidden" /> 후원하세요{" "}
          <span className="text-primary">.</span>
        </h1>
      </div>

      <PlayerSlider />
    </div>
  );
}
