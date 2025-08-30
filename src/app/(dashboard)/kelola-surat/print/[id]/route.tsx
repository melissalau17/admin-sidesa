import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const token = request.headers.get("Authorization");

        if (!token) {
            return new NextResponse("Authorization header is missing", { status: 401 });
        }

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}/print`,
            {
                headers: {
                    Authorization: token,
                },
                responseType: "arraybuffer",
            }
        );

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