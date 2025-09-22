import * as api from "../services/api";

export const uploadAndReturnDocument = async (file: File) => {
  return await api.uploadDocument(file);
};

export const fetchDocument = async (id: string) => {
  return await api.getDocument(id);
};

export const askQuestion = async (id: string, question: string) => {
  const result = await api.askDocument(id, question);
  return result.answer;
};
