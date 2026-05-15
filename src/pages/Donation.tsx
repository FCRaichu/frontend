import PlayerSlider from "@/features/donation/components/PlayerSlider";

export default function DonationPage() {
  return (
    <div className="min-h-[calc(100vh-61px)] bg-secondary">
      <div className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <h2 className="text-primary text-sm md:text-lg lg:text-xl font-black italic tracking-widest mb-1 md:mb-2">
          PLAYER SUPPORT
        </h2>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight md:leading-tight lg:leading-tight">
          당신의 선수에게 <br /> 후원하세요{" "}
          <span className="text-primary">.</span>
        </h1>
      </div>

      <PlayerSlider />
    </div>
  );
}
