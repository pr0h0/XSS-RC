import { useContext } from "react";
import { StateContext } from "../../data/stateContext";
import { Link } from "react-router";

export default function Dashboard() {
  const { value } = useContext(StateContext);

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="flex-1 flex flex-col p-4">
        <h1 className="h-[72px] bg-white text-4xl p-4 text-center mb-4">
          Dashboard
        </h1>

        <div className="w-full flex-1 flex md:flex-row flex-col flex-nowrap md:flex-wrap gap-4 content-stretch items-stretch justify-center">
          <Link
            to="/scripts"
            className="min-w-[300px] flex-1 basis-full lg:basis-1/3 p-4 min-h-[15vh] lg:min-h-[33vh] flex justify-center items-center border border-solid border-white bg-white text-3xl text-blue-500"
          >
            <span className="bg-white p-4 inline-block text-center text-6xl">
              [{value.scriptsCount}]<br /> Scripts
            </span>
          </Link>
          <Link
            to="/sessions"
            className="min-w-[300px] flex-1 basis-full lg:basis-1/3 p-4 min-h-[15vh] lg:min-h-[33vh] flex justify-center items-center border border-solid border-white bg-white text-3xl text-blue-500"
          >
            <span className="bg-white p-4 inline-block text-center text-6xl">
              [{value.sessionsCount}]<br /> Sessions
            </span>
          </Link>
          <Link
            to="/history"
            className="min-w-[300px] flex-1 basis-full lg:basis-1/3 p-4 min-h-[15vh] lg:min-h-[33vh] flex justify-center items-center border border-solid border-white bg-white text-3xl text-blue-500"
          >
            <span className="bg-white p-4 inline-block text-center text-6xl">
              [{value.historyCount}]<br /> History
            </span>
          </Link>
          <Link
            to="/history?type=Screenshot"
            className="min-w-[300px] flex-1 basis-full lg:basis-1/3 p-4 min-h-[15vh] lg:min-h-[33vh] flex justify-center items-center border border-solid border-white bg-white text-3xl text-blue-500"
          >
            <span className="bg-white p-4 inline-block text-center text-6xl">
              [{value.screenshotsCount}]<br /> Screenshots
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
