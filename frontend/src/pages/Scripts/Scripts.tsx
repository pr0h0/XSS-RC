import React, { useContext, useState } from "react";
import { StateContext } from "../../data/stateContext";
import scriptService from "../../services/ScriptService";
import ToggleDrawer from "../../Components/ToggleDrawer/ToggleDrawer";
import Icon from "../../Components/Icon/Icon";

export default function Scripts() {
  const { value, update } = useContext(StateContext);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const sessionCounts = value.sessions.reduce(
    (acc, s) => {
      acc[s.scriptId] = (acc[s.scriptId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const site = formData.get("site") as string;
    const script = await scriptService.createNewScript({ name, site });
    update({
      scripts: [script, ...value.scripts],
      scriptsCount: value.scriptsCount + 1,
    });
    (e.target as HTMLFormElement).reset();
  };

  const copyScriptElement = (id: number) => {
    const script = value.scripts.find((s) => s.id === id);
    if (!script) return;

    const protocol = window.location.protocol;
    const host = window.location.host;
    const element = `<script src="${protocol}//${host}/scripts/${id}/script.js" type="module" id="script-rc" data-script-id="${script.id}"></script>`;
    navigator.clipboard.writeText(element);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 4000);
  };

  const deleteScript = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this script?")) return;
    const scripts = (await scriptService.deleteScript(id)) ?? [];
    update({ scripts, scriptsCount: scripts.length });
  };

  const openExamplePage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = (e.target as HTMLAnchorElement).closest<HTMLAnchorElement>("a");
    window.open(el?.href);
  };

  return (
    <div
      className="flex flex-row flex-1 bg-indigo-100 overflow-auto"
      style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      <div className="flex-1 flex flex-col p-4 gap-4">
        <h1 className="h-[72px] bg-white text-4xl p-4 text-center">Scripts</h1>
        <ToggleDrawer id="new-script" title="New script" persist>
          <form
            onSubmit={handleFormSubmit}
            className="w-full flex flex-col gap-4 py-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="bg-gray-50 border border-solid border-gray-400 p-2"
            />
            <input
              type="text"
              name="site"
              placeholder="Site"
              required
              className="bg-gray-50 border border-solid border-gray-400 p-2"
            />
            <button
              type="submit"
              className="w-full bg-green-300 hover:bg-green-500 border border-solid border-gray-50 p-2 text-black hover:text-white"
            >
              Create
            </button>
          </form>
        </ToggleDrawer>

        <ToggleDrawer id="scripts-list" title="Existing scripts" persist>
          <table className="w-full border border-solid border-white p-4 bg-white">
            <thead>
              <tr className="border-b border-solid border-gray-200 p-4">
                <th className="w-1/6 p-2 text-xl">ID</th>
                <th className="w-1/6 p-2 text-xl">Name</th>
                <th className="w-1/6 p-2 text-xl">Site</th>
                <th className="w-1/6 p-2 text-xl">Count</th>
                <th className="w-1/6 p-2 text-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {value.scripts.map((script) => (
                <tr
                  className="w-full border-b border-solid border-gray-200 p-4"
                  key={script.id}
                >
                  <td className="p-2 text-base text-center">{script.id}</td>
                  <td className="p-2 text-base text-center">{script.name}</td>
                  <td className="p-2 text-base text-center">{script.site}</td>
                  <td className="p-2 text-base text-center">
                    {sessionCounts[script.id] ?? 0}
                  </td>
                  <td className="p-2 text-base text-center pr-4 flex flex-row justify-center">
                    <button
                      onClick={() => copyScriptElement(script.id)}
                      className={`p-2 text-base px-4 text-center ${
                        copiedId === script.id
                          ? "bg-green-500 text-white"
                          : "hover:bg-green-500 hover:text-white text-green-300"
                      }`}
                      title="Copy script element"
                    >
                      <Icon name="copy" className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => deleteScript(script.id)}
                      className="p-2 text-base px-4 hover:bg-red-500 hover:text-white text-red-300 text-center"
                      title="Delete the script"
                    >
                      <Icon name="trash" className="w-8 h-8" />
                    </button>
                    <a
                      href={`/example/${script.id}?test=true`}
                      onClick={openExamplePage}
                      target="_blank"
                      className="p-2 text-base px-4 hover:bg-orange-500 hover:text-white text-orange-300 text-center"
                      title="Preview script"
                    >
                      <Icon name="eye" className="w-8 h-8" />
                    </a>
                  </td>
                </tr>
              ))}
              {value.scripts.length === 0 && (
                <tr>
                  <td colSpan={5} className="w-full text-center p-4 text-xl">
                    No scripts created
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ToggleDrawer>
        <span className="flex-1 inline-block"></span>
      </div>
    </div>
  );
}
