import { useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { StateContext } from "../../data/stateContext";
import scriptService from "../../services/ScriptService";

export default function Example() {
  const { value } = useContext(StateContext);
  const { id } = useParams();

  const queryEntries = useMemo(
    () => Object.entries(Object.fromEntries(new URLSearchParams(window.location.search).entries())),
    []
  );

  const script = useMemo(
    () => value.scripts.find((script) => script.id === Number(id)),
    [id, value.scripts]
  );

  function handleGoBackClick() {
    const url = "/scripts";
    if (window.opener && window.opener.location?.href.includes("/scripts")) {
      window.close();
    } else {
      window.location.href = url;
    }
  }

  useEffect(() => {
    if (script) {
      if (!document.querySelector("script#script-rc")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "script-rc";
        scriptEl.src = scriptService.getScriptUrl(script.id);
        scriptEl.setAttribute("type", "module");
        scriptEl.async = true;
        document.body.appendChild(scriptEl);
        scriptEl.onload = () => {
          console.log("Script loaded");
        };
        scriptEl.onerror = () => {
          console.error("Error loading script");
        };
      }
    }
  }, [script]);

  return (
    <>
      <div className="flex flex-row flex-1 bg-indigo-100 h-screen">
        <div className="flex-1 flex items-center justify-center bg-indigo-100">
          <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 items-center">
            <h1 className="text-2xl font-bold text-center">
              XSS Remote Control by{" "}
              <a href="https://github.com/pr0h0" className="underline">
                @pr0h0
              </a>
            </h1>
            <p className="text-center">Example page to test script</p>
            <p className="text-center">
              Keep this tab opened and connect on sessions page
            </p>
            <p className="text-center">
              To test Post-Exploitation using XSS - RC
            </p>
            <p className="text-center">
              Reflected query (vulnerable to HTML Injection)
              <br />
              <span
                dangerouslySetInnerHTML={{
                  __html: queryEntries.map(([k, v]) => `${k},${v}`).join("<br />"),
                }}
              ></span>
            </p>
            <p className="text-center font-bold">Script ID: {script?.id}</p>
            <p className="text-center font-bold">Script Name: {script?.name}</p>
            <p className="text-center font-bold">Script Site: {script?.site}</p>
            <div className="flex justify-center mt-4 w-full">
              <textarea
                placeholder="Test keylogger"
                className="w-full max-w-80 py-2 px-4 rounded border border-solid border-black"
                rows={5}
              ></textarea>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleGoBackClick}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Go back to scripts
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
