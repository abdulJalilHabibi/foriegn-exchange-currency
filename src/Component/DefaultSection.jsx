export default function DefaultSection({ heading, text }) {
  return (
    <div className="flex justify-center items-center gap-2 flex-col font-jetbrains mt-4">
      <h4 className="text-[#c6c6c6] text-[16px] md:text-[18px]">{heading}</h4>
      <p className="text-[#9d9d9d] w- text-center md:w-120">{text}</p>
    </div>
  );
}
