type Props = {
  width?: string;
  height?: string;
};

export default function Loading({ width = "64px", height = "64px" }: Props) {
  return (
    <div
      style={{ gap: parseInt(width) * 0.5, width: parseInt(width) * 2 * 2 }}
      className="flex justify-center items-center p-4 flex-wrap"
    >
      <span
        style={{ width, height }}
        className="loadingAnimation inline-block rounded-tl-[100%] rounded-br-[50%] border border-solid border-opacity-25 border-white bg-indigo-300 w-full h-full origin-bottom-right"
      />
      <span
        style={{ width, height }}
        className="loadingAnimation animation-paused inline-block rounded-tr-[100%] rounded-bl-[50%] border border-solid border-opacity-25 border-white bg-indigo-300 w-full h-full origin-bottom-left"
      />
      <span
        style={{ width, height }}
        className="loadingAnimation animation-paused inline-block rounded-bl-[100%] rounded-tr-[50%] border border-solid border-opacity-25 border-white bg-indigo-300 w-full h-full origin-top-right"
      />
      <span
        style={{ width, height }}
        className="loadingAnimation inline-block rounded-br-[100%] rounded-tl-[50%] border border-solid border-opacity-25 border-white bg-indigo-300 w-full h-full origin-top-left"
      />
    </div>
  );
}
