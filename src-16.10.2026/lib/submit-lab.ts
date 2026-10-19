const SERVER = "https://AlexZelenskiy.pythonanywhere.com/";

export type LabPayload = Record<string, string>;

/** Відправляє відповіді учня на той самий бекенд, що й у попередній версії сайту. */
export async function submitLab(sheetName: string, values: LabPayload) {
  const now = new Date();
  const body = {
    text: {
      date: now.toLocaleDateString("uk-UA"),
      time: now.toLocaleTimeString("uk-UA"),
      ...values,
    },
    idTable: "",
    sheet: sheetName,
  };

  const res = await fetch(`${SERVER}add_lab/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}
