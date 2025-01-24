import { useContext } from "react";
import { Link } from "react-router";
import { StateContext } from "../../data/stateContext";

export default function Home() {
  const { value } = useContext(StateContext);

  let ctaUrl = "/scripts";
  let ctaText = "Create a script";

  if (value.scripts.length) {
    ctaUrl = "/sessions";
    ctaText = "Check sessions";

    const activeSession = value.sessions.find((s) => s.status === "Active");

    if (activeSession) {
      ctaUrl += "/" + activeSession.sessionId;
      ctaText = "View active session";
    }
  }

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="flex-1 flex items-center justify-center bg-indigo-100">
        <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to XSS-RC by&nbsp;
            <a
              href="https://github.com/pr0h0"
              target="_blank"
              className="underline text-blue-500"
            >
              @pr0h0
            </a>
          </h1>
          <p className="text-center">
            Post-Exploitation XSS tool to gather informations and escalate it
            further
          </p>
          <ul className="m-auto">
            <li>
              1. Create&nbsp;
              <Link to="/scripts" className="underline text-blue-500">
                script
              </Link>
            </li>
            <li>2. Inject script to target website</li>
            <li>3. Or view example page to test the tool</li>
            <li>
              4. Check&nbsp;
              <Link className="underline text-blue-500" to="/sessions">
                sessions
              </Link>
              &nbsp; for active&nbsp;
              <Link
                className="underline text-blue-500"
                to="/sessions?status=Active"
              >
                session
              </Link>
            </li>
            <li>5. Play around with active session</li>
          </ul>
          <div className="flex justify-center mt-4">
            <Link
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              to={ctaUrl}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
