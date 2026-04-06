import { Link, useLocation } from "react-router-dom";
import { Cctv, House, Trees, RotateCcw } from "lucide-react";

const navItems = [
  { id: 1, link: "/doorbird", label: "DoorBird", icon: Cctv },
  { id: 2, link: "/", label: "Main Floor", icon: House },
  { id: 3, link: "/outside", label: "Outside", icon: Trees },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="w-[90%] mb-3 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl pointer-events-auto">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = location.pathname === item.link;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={item.link}
                className="flex-1"
              >
                <div
                  className={`flex flex-col items-center gap-1.5 py-3.5 px-2 transition-all ${
                    isActive ? "text-white" : "text-zinc-600"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-xs font-semibold leading-none tracking-wide">
                    {item.label}
                  </span>
                  <div
                    className={`mt-0.5 h-1 w-4 rounded-full transition-all duration-200 ${
                      isActive ? "opacity-100 bg-white" : "opacity-0 w-1"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
          <button
            onClick={async () => {
              const keys = await caches.keys();
              await Promise.all(keys.map((k) => caches.delete(k)));
              window.location.reload();
            }}
            className="flex-1"
          >
            <div className="flex flex-col items-center gap-1.5 py-3.5 px-2 transition-all text-zinc-600 hover:text-zinc-300">
              <RotateCcw size={20} strokeWidth={1.8} />
              <span className="text-xs font-semibold leading-none tracking-wide">
                Reload
              </span>
              <div className="mt-0.5 h-1 w-4 rounded-full opacity-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;