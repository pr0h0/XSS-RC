import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { StateContext } from "../../data/stateContext";
import ToggleDrawer from "../../Components/ToggleDrawer/ToggleDrawer";
import historyService from "../../services/HistoryService";
import HistoryType from "../../types/history";

export default function History() {
  const { value, update } = useContext(StateContext);
  const [selected, setSelected] = useState<{ [id: number]: boolean }>({});
  const [searchParams, updateSearch] = useSearchParams();

  const search = {
    id: searchParams.get("id") || "",
    sessionId: searchParams.get("sessionId") || "",
    type: searchParams.get("type") || "All",
    timeFrom: searchParams.get("timeFrom") || "",
    timeTo: searchParams.get("timeTo") || "",
    content: searchParams.get("content") || "",
    response: searchParams.get("response") || "",
    page: searchParams.get("page") || "1",
  };

  const currentPage = Number(search.page);
  const prevPage = currentPage > 1 ? currentPage - 1 : 0;
  const nextPage = currentPage + 1;
  const isLastPage = value.history.length < 50;

  const fetchHistory = useCallback(() => {
    const params = new URLSearchParams();
    if (search.id) params.set("id", search.id);
    if (search.sessionId) params.set("sessionId", search.sessionId);
    if (search.type !== "All") params.set("type", search.type);
    if (search.timeFrom) params.set("timeFrom", search.timeFrom);
    if (search.timeTo) params.set("timeTo", search.timeTo);
    if (search.content) params.set("content", search.content);
    if (search.response) params.set("response", search.response);
    params.set("page", search.page);

    historyService.getAll(params).then((data) => {
      if (data?.history) {
        update({ history: data.history });
      }
    });
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) params.set(key, value.toString());
    }
    params.set("page", "1");
    updateSearch(params);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).closest("form")?.requestSubmit();
    }
  };

  const toggleSelectAll = () => {
    const allSelected =
      Object.values(selected).every((x) => x) &&
      Object.keys(selected).length > 0;
    if (allSelected) {
      setSelected({});
      return;
    }
    const newSelected = value.history.reduce((acc, x) => {
      acc[x.id] = true;
      return acc;
    }, {} as { [id: number]: boolean });
    setSelected(newSelected);
  };

  const handleSelectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setSelected((prev) => {
        const next = { ...prev };
        delete next[Number(e.target.value)];
        return next;
      });
      return;
    }
    setSelected({
      ...selected,
      [Number(e.target.value)]: true,
    });
  };

  const handleDeleteHistoryItem = async () => {
    if (!confirm("Are you sure you want to delete the selected items?")) return;
    const ids = Object.keys(selected).map(Number);
    const res = await historyService.delete(ids);
    if (res) {
      const newHistory = value.history.filter(
        (history) => !ids.includes(history.id)
      );
      setSelected({});
      update({ history: newHistory });
    }
  };

  const prevPageLink = `/history?${new URLSearchParams({
    ...search,
    page: prevPage.toString(),
  }).toString()}`;
  const nextPageLink = `/history?${new URLSearchParams({
    ...search,
    page: nextPage.toString(),
  }).toString()}`;

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="flex-1 flex bg-indigo-100">
        <div className="flex-1 flex flex-col p-4 overflow-auto gap-4">
          <h1 className="h-[72px] bg-white text-4xl p-4 text-center">
            History
          </h1>
          <ToggleDrawer id="search-history" title="Search History" persist>
            <form
              className="w-full flex flex-wrap gap-4 items-center"
              onSubmit={handleSubmit}
            >
              <input
                type="number"
                name="id"
                className="w-28 h-12 p-2 border border-solid border-black"
                placeholder="ID"
                defaultValue={search.id}
                onKeyDown={handleKeyDown}
              />
              <input
                type="search"
                name="sessionId"
                className="flex-1 basis-28 h-12 p-2 border border-solid border-black"
                placeholder="Session ID"
                defaultValue={search.sessionId}
                list="sessions-list"
                onKeyDown={handleKeyDown}
              />
              <datalist id="sessions-list">
                {value.sessions.map((session) => (
                  <option key={session.sessionId} value={session.sessionId}>
                    {session.name}
                  </option>
                ))}
              </datalist>

              <select
                name="type"
                className="flex-1 basis-32 h-12 p-2 border border-solid border-black w-40"
                defaultValue={search.type}
                onChange={(e) => e.target.closest("form")?.requestSubmit()}
              >
                <option>All</option>
                <option value="command">Command</option>
                <option value="connect">Connect</option>
                <option value="disconnect">Disconnect</option>
                <option value="screenshot">Screenshot</option>
              </select>

              <div className="flex-1 basis-32 flex flex-col">
                <input
                  type="datetime-local"
                  name="timeFrom"
                  className="p-2 border border-solid border-black"
                  placeholder="Time from"
                  defaultValue={search.timeFrom}
                />
                <input
                  type="datetime-local"
                  name="timeTo"
                  className="p-2 border border-solid border-black"
                  placeholder="Time to"
                  defaultValue={search.timeTo}
                />
              </div>

              <input
                type="search"
                name="content"
                className="flex-1 basis-48 h-12 p-2 border border-solid border-black"
                placeholder="Content"
                defaultValue={search.content}
                onKeyDown={handleKeyDown}
              />
              <input
                type="search"
                name="response"
                className="flex-1 basis-48 h-12 p-2 border border-solid border-black"
                placeholder="Response"
                defaultValue={search.response}
                onKeyDown={handleKeyDown}
              />
            </form>
          </ToggleDrawer>
          <ToggleDrawer id="history-table" title="History items" persist>
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
                  <th className="p-4 w-2/12">Type</th>
                  <th className="p-4 w-2/12">Time</th>
                  <th className="p-4 w-2/12">Content</th>
                  <th className="p-4 w-2/12">Response</th>
                </tr>
              </thead>
              <tbody>
                {value.history.map((history) => (
                  <HistoryRow
                    key={history.id}
                    history={history}
                    selected={selected[history.id] ?? false}
                    onToggle={handleSelectToggle}
                  />
                ))}
                {value.history.length === 0 && (
                  <tr>
                    <td className="text-center p-4 text-xl" colSpan={5}>
                      No history found
                    </td>
                  </tr>
                )}
                {value.history.length > 0 && (
                  <tr className="h-16">
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={handleDeleteHistoryItem}
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
                        className={`p-4 m-4 rounded-lg mx-2 ${
                          isLastPage
                            ? "bg-gray-300 text-gray-500 pointer-events-none"
                            : "bg-gray-300 text-gray-500"
                        }`}
                        to={isLastPage ? "#" : nextPageLink}
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
    </div>
  );
}

const HistoryRow = ({
  history,
  selected,
  onToggle,
}: {
  history: HistoryType;
  selected: boolean;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [expandedContent, setExpandedContent] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState(false);

  const isLongContent = history.content?.length > 100;
  const isLongResponse = history.response?.length > 100;

  return (
    <tr
      className={`border-b border-solid border-gray-400 max-h-32 overflow-auto ${
        selected ? "bg-red-500 text-white" : ""
      }`}
    >
      <td className="text-center">
        <label className="cursor-pointer w-full hover:text-white hover:bg-red-500 block p-4">
          <input
            type="checkbox"
            value={history.id}
            className="origin-center scale-150"
            checked={selected}
            onChange={onToggle}
          />
        </label>
      </td>
      <td className="text-blue-500 underline text-center hover:text-white hover:bg-blue-500 cursor-pointer">
        <Link to={`/sessions/${history.sessionId}?messageId=${history.id}`}>
          {history.id}
        </Link>
      </td>
      <td className="text-blue-500 underline text-center">
        <Link to={`/sessions/${history.sessionId}`}>{history.sessionId}</Link>
      </td>
      <td className="text-center capitalize">{history.type}</td>
      <td className="text-center">
        {new Date(history.updatedAt)
          ?.toISOString()
          .slice(0, -5)
          .split("T")
          .map((x) => (
            <React.Fragment key={x}>
              {x}
              <br />
            </React.Fragment>
          ))}
      </td>
      <td
        className={`text-center max-h-32 overflow-auto ${
          isLongContent ? "cursor-pointer" : ""
        }`}
        title={isLongContent ? "Click to expand" : undefined}
        onClick={() => isLongContent && setExpandedContent(!expandedContent)}
      >
        {expandedContent || !isLongContent
          ? history.content
          : history.content.slice(0, 100) + "..."}
      </td>
      <td
        className={`text-center max-h-32 overflow-auto ${
          isLongResponse ? "cursor-pointer" : ""
        }`}
        title={isLongResponse ? "Click to expand" : undefined}
        onClick={() =>
          isLongResponse && setExpandedResponse(!expandedResponse)
        }
      >
        {expandedResponse || !isLongResponse
          ? history.response
          : (history.response?.slice(0, 100) ?? "") + "..."}
      </td>
    </tr>
  );
};
