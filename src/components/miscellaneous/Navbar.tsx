import { Link, useLocation } from "react-router-dom";
import { House, Trees, LayoutPanelTop } from "lucide-react";

const navItems = [
  { id: 1, link: "/", label: "Home", icon: House },
  { id: 2, link: "/main-floor", label: "Main Floor", icon: LayoutPanelTop },
  { id: 3, link: "/outside", label: "Outside", icon: Trees },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="w-[90%] mb-3 rounded-3xl overflow-hidden border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg pointer-events-auto">
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
                  className={`flex flex-col items-center gap-1 py-3 px-2 transition-all ${
                    isActive ? "text-black" : "text-neutral-500"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-xs font-medium leading-none">
                    {item.label}
                  </span>
                  <div
                    className={`mt-0.5 h-1 w-1 rounded-full transition-opacity ${
                      isActive ? "opacity-100 bg-black" : "opacity-0"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;