import { createContext, useState } from "react";
import { State, type StateContext as StateContextType } from "../types/state";

const defaultValue: StateContextType = {
  value: {
    sessions: [],
    sessionsCount: 0,
    history: [],
    historyCount: 0,
    screenshotsCount: 0,
    scripts: [],
    scriptsCount: 0,
    hasAccess: false,
  },
  update: () => Promise.resolve(defaultValue.value),
};

type Props = {
  children: JSX.Element;
};

// eslint-disable-next-line react-refresh/only-export-components
export const StateContext = createContext(defaultValue);

export default function StateContextWrapper({ children }: Props) {
  const [value, setValue] = useState(defaultValue.value);
  const update = (value: Partial<State>): Promise<State> => {
    return new Promise((resolve) => {
      setValue((prevValue) => {
        const newValue = { ...prevValue, ...value };
        resolve(newValue);
        return newValue;
      });
    });
  };

  return (
    <StateContext.Provider value={{ value, update }}>
      {children}
    </StateContext.Provider>
  );
}
