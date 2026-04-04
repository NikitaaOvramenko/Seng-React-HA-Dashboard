export default function CallModal() {
  return (
    <div className="fixed modal inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.71)]">
      <div className="flex h-[50%] w-[50%] flex-col rounded-2xl bg-red-200">
        <div className="top h-[70%] w-full"></div>
        <div className="bottom flex h-[30%] w-full"></div>
      </div>
    </div>
  );
}