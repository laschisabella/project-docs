export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:3000/documents", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
};

export const getDocument = async (id: string) => {
  const res = await fetch(`http://localhost:3000/documents/${id}`);
  if (!res.ok) throw new Error("Documento not found");
  return res.json();
};

export const askDocument = async (id: string, question: string) => {
  const res = await fetch(`http://localhost:3000/documents/${id}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) throw new Error("Error asking question");
  return res.json();
};
