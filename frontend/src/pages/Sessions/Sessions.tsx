import React, { ChangeEventHandler, useContext, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import ToggleDrawer from "../../Components/ToggleDrawer/ToggleDrawer";
import { StateContext } from "../../data/stateContext";
import dataService from "../../services/DataService";
import sessionsService from "../../services/SessionsService";
import History from "../../types/history";
import Session from "../../types/session";
import HelperService from "../../services/HelperService";

export default function Sessions() {
  const { value, update } = useContext(StateContext);
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<{ [id: number]: boolean }>({});
  const [searchParams, updateSearch] = useSearchParams();

  const search = useMemo(
    () => ({
      status: searchParams.get("status") || "All",
      id: searchParams.get("id") || "",
      sessionId: searchParams.get("sessionId") || "",
      name: searchParams.get("name") || "",
      description: searchParams.get("description") || "",
      timeFrom: searchParams.get("timeFrom") || "",
      timeTo: searchParams.get("timeTo") || "",
      scriptId: searchParams.get("scriptId") || "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams]
  );

  const handleValueUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch({
      ...Object.fromEntries(searchParams.entries()),
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteSessions = async () => {
    const ids = Object.keys(selected).map(Number);
    if (!ids.length) return;
    if (!window.confirm("Are you sure you want to delete these sessions?")) {
      return;
    }
    const res = await sessionsService.delete(ids);
    console.log(res);
  };

  const openSingleSession = (id: string) => {
    navigate(`/sessions/${id}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sessionsService
      .getAll(searchParams)
      .then((data: { sessions: Session[]; history: History[] }) => {
        update({
          sessions: HelperService.mergeArrayByKey<Session>(
            value.sessions,
            data.sessions,
            "id"
          ),
          history: HelperService.mergeArrayByKey<History>(
            value.history,
            data.history,
            "id"
          ),
        });
      })
      .catch((err: Error) => {
        console.error(err);
      });
  };

  const toggleSelectAll = () => {
    const allSelected =
      Object.values(selected).every((x) => x) &&
      Object.keys(selected).length > 0;
    if (allSelected) {
      setSelected({});
      return;
    }
    const newSelected = value.sessions.reduce((acc, x) => {
      acc[x.id] = true;
      return acc;
    }, {} as { [id: number]: boolean });
    setSelected(newSelected);
  };

  const handleSelectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setSelected((prev) => {
        delete prev[Number(e.target.value)];
        return { ...prev };
      });
      return;
    }
    setSelected({
      ...selected,
      [Number(e.target.value)]: true,
    });
  };

  const currentPage = Number(search.page);
  const prevPage = currentPage > 1 ? currentPage - 1 : 0;
  const nextPage = currentPage + 1;

  const prevPageLink = `/history?${dataService.convertObjectToQuery({
    ...search,
    page: prevPage.toString(),
  })}`;
  const nextPageLink = `/history?${dataService.convertObjectToQuery({
    ...search,
    page: nextPage.toString(),
  })}`;

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100 overflow-auto"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="flex-1 flex flex-col p-4 gap-4">
        <h1 className="h-[72px] bg-white text-4xl p-4 text-center">Scripts</h1>

        <ToggleDrawer id="search-sessions" title="Search Sessions" persist>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-wrap gap-4 items-center"
          >
            <input
              type="number"
              name="id"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black"
              placeholder="ID"
              value={search.id}
              onChange={handleValueUpdate}
            />
            <input
              type="search"
              name="sessionId"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black"
              placeholder="Session ID"
              value={search.sessionId}
              onChange={handleValueUpdate}
            />

            <select
              name="status"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black w-40"
              value={search.status}
              onChange={
                handleValueUpdate as unknown as ChangeEventHandler<HTMLSelectElement>
              }
            >
              <option>All</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <input
              type="search"
              name="name"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black"
              placeholder="Session Name"
              value={search.name}
              onChange={handleValueUpdate}
            />
            <input
              type="description"
              name="description"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black"
              placeholder="Session Description"
              value={search.description}
              onChange={handleValueUpdate}
            />

            <div className="flex-1 basis-32 flex flex-col">
              <input
                type="datetime-local"
                name="timeFrom"
                className="p-2 border border-solid border-black"
                placeholder="Time from"
                value={search.timeFrom}
                onChange={handleValueUpdate}
              />
              <input
                type="datetime-local"
                name="timeTo"
                className="p-2 border border-solid border-black"
                placeholder="Time to"
                value={search.timeTo}
                onChange={handleValueUpdate}
              />
            </div>

            <input
              type="number"
              name="scriptId"
              className="flex-1 basis-32 h-12 p-2 border border-solid border-black"
              placeholder="Script ID"
              defaultValue={search.scriptId}
              onChange={handleValueUpdate}
            />
            <button
              type="submit"
              className="flex-1 basis-32 h-12 p-2 bg-blue-500 text-white"
            >
              Search
            </button>
          </form>
        </ToggleDrawer>

        <ToggleDrawer id="existing-sessions" title="Existing Sessions" persist>
          <table className="w-full bg-white">
            <thead className="border-b border-solid border-black">
              <tr>
                <th
                  className="p-4 w-4 cursor-pointer"
                  onClick={toggleSelectAll}
                >
                  Select All
                </th>
                <th className="p-4 w-1/12">ID</th>
                <th className="p-4 w-2/12">Session ID</th>
                <th className="p-4 w-2/12">Session Status</th>
                <th className="p-4 w-2/12">Session Name</th>
                <th className="p-4 w-2/12">Session Description</th>
                <th className="p-4 w-2/12">Session Time</th>
                <th className="p-4 w-1/12">Script ID</th>
              </tr>
            </thead>
            <tbody>
              {value.sessions.map((session) => (
                <React.Fragment key={session.id}>
                  <tr className="border-b border-solid border-gray-400">
                    <td className="text-center">
                      <label className="cursor-pointer w-full hover:text-white hover:bg-red-500 block p-4">
                        <input
                          type="checkbox"
                          value={session.id}
                          className="origin-center scale-150"
                          checked={selected[session.id] || false}
                          onChange={handleSelectToggle}
                        />
                      </label>
                    </td>
                    <td
                      className="text-blue-500 underline text-center hover:text-white hover:bg-blue-500 cursor-pointer"
                      onClick={() => openSingleSession(session.sessionId)}
                      data-id={session.id}
                    >
                      {session.id}
                    </td>
                    <td className="text-center">{session.sessionId}</td>
                    <td
                      className={`text-center ${
                        session.status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {session.status}
                    </td>
                    <td className="text-center">{session.name}</td>
                    <td className="text-center">{session.description}</td>
                    <td className="text-center">
                      {session.time
                        .slice(0, -5)
                        .split("T")
                        .map((x) => (
                          <React.Fragment key={x}>
                            {x}
                            <br />
                          </React.Fragment>
                        ))}
                    </td>
                    <td className="text-center">{session.scriptId}</td>
                  </tr>
                  <tr className="border-b border-solid border-black opacity-50">
                    <td
                      colSpan={6}
                      className="text-center border-r border-gray-400"
                    >
                      UA: {session.ua}
                    </td>
                    <td colSpan={2} className="text-center">
                      IP: {session.ip}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {!value.sessions.length ? (
                <tr>
                  <td className="text-center p-4 text-xl" colSpan={5}>
                    No sessions found
                  </td>
                </tr>
              ) : (
                <tr className="h-16">
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={handleDeleteSessions}
                      disabled={!Object.keys(selected).length}
                      className={`${
                        Object.keys(selected).length
                          ? "bg-red-500"
                          : "bg-gray-500"
                      } text-white p-4`}
                    >
                      Delete
                    </button>
                  </td>
                  <td colSpan={6} className="text-center">
                    <Link
                      className="p-4 m-4 bg-gray-300 text-gray-500 rounded-lg mx-2"
                      to={prevPage ? prevPageLink : "#"}
                    >
                      Previous
                    </Link>
                    <span className="p-4 m-4 bg-blue-400 rounded-lg mx-2 whitespace-nowrap">
                      Page {currentPage}
                    </span>
                    <Link
                      className="p-4 m-4 bg-gray-300 text-gray-500 rounded-lg mx-2"
                      to={nextPage ? nextPageLink : "#"}
                    >
                      Next
                    </Link>
                  </td>
                  <td colSpan={1}>&nbsp;</td>
                </tr>
              )}
            </tbody>
          </table>
        </ToggleDrawer>
      </div>
    </div>
  );
}
