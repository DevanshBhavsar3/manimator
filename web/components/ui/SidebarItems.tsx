export default function SidebarItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-1 items-center cursor-pointer border border-neutral-500 hover:bg-neutral-600 w-full rounded-md p-2 text-md text-neutral-200 ${className}`}
    >
      {children}
    </div>
  );
}
