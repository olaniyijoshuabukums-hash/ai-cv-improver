import {
  CVUploadResponse,
  ImproveCVRequest,
  ImproveCVResponse,
  GenerateCoverLetterRequest,
  GenerateCoverLetterResponse,
  ParsedCV,
  ExportRequest,
} from "@/types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export const apiClient = {
  async uploadCV(file: File): Promise<CVUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-cv", {
      method: "POST",
      body: formData,
    });

    return handleResponse<CVUploadResponse>(res);
  },

  async improveCV(data: ImproveCVRequest): Promise<ImproveCVResponse> {
    const res = await fetch("/api/improve-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return handleResponse<ImproveCVResponse>(res);
  },

  async generateCoverLetter(
    data: GenerateCoverLetterRequest
  ): Promise<GenerateCoverLetterResponse> {
    const res = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return handleResponse<GenerateCoverLetterResponse>(res);
  },

  async exportDocument(data: ExportRequest): Promise<Blob> {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Export failed" }));
      throw new Error(error.error || "Export failed");
    }

    return res.blob();
  },
};
