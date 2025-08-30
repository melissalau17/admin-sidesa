import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const token = request.headers.get("Authorization");

    if (!token) {
      return new NextResponse("Authorization header is missing", { status: 401 });
    }

    // Use a robust retry mechanism for the API call
    let response;
    const retries = 3;
    const initialDelay = 1000;

    for (let i = 0; i < retries; i++) {
      try {
        // ... (your axios request)
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}/print`,
          {
            headers: {
              Authorization: token,
            },
            responseType: "arraybuffer",
          }
        );
        break; // Exit the loop on success
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(`Attempt ${i + 1} failed:`, err.message);
        } else {
          console.error(`Attempt ${i + 1} failed with unknown error:`, err);
        }
        if (i < retries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw err; // Re-throw the error on the last attempt
        }
      }
    }

    if (!response) {
      throw new Error("Failed to get a response from the backend after multiple retries.");
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers["content-type"] || "application/pdf");
    headers.set("Content-Disposition", response.headers["content-disposition"] || `inline; filename=surat_${id}.pdf`);

    return new NextResponse(response.data, {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error("Failed to fetch PDF from backend:", error);
    return new NextResponse("Failed to fetch PDF", { status: 500 });
  }
}