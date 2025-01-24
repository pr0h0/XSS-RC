type Props = {
  children: React.ReactNode;
  className?: string;
};
export default function LayoutWrapper({ children, className }: Props) {
  return (
    <div
      className={`w-full h-screen overflow-auto flex justify-start items-start bg-indigo-400 ${className}`}
    >
      {children}
    </div>
  );
}
