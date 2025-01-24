import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";

type Props = {
  children: JSX.Element | JSX.Element[];
  id: string;
  persist: boolean;
  title: string | JSX.Element;
};

export default function ToggleDrawer({ children, id, persist, title }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (persist) {
      const value = localStorage.getItem(`toggle-${id}`);
      if (value === undefined) {
        localStorage.setItem(`toggle-${id}`, "true");
        setOpen(true);
      } else if (value) {
        setOpen(value === "true");
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDrawer = () => {
    setOpen((prev) => {
      if (persist) {
        localStorage.setItem(`toggle-${id}`, (!prev).toString());
      }
      return !prev;
    });
  };

  return (
    <div className="w-full flex flex-col border border-solid border-white p-4 bg-white">
      <h1 className="w-full">
        <button
          onClick={toggleDrawer}
          className="text-blue-500 cursor-pointer flex-1 w-full py-4 px-2 flex items-center text-xl border-b border-solid border-black"
        >
          <Icon className="w-8 h-8 mr-4" name="hamburger" />
          <span className="flex-1 text-left">{title}</span>
          <Icon className="w-8 h-8" name={open ? "caretUp" : "caretDown"} />
        </button>
      </h1>
      {open && children}
    </div>
  );
}
