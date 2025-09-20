"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type SuratViewProps = {
    params: { id: string };
};

export default function SuratView({ params }: SuratViewProps) {
    const { id } = params;
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Authorization token not found.");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}/print`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        responseType: "blob",
                    }
                );

                const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                setPdfUrl(fileURL);
            } catch (error) {
                console.error("Failed to fetch PDF:", error);
                setPdfUrl(null); // Reset state on error
            }
        };

        if (id) {
            fetchPdf();
        }
    }, [id]);

    if (!pdfUrl) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Memuat PDF...
            </div>
        );
    }

    // Render the fetched PDF inside an iframe
    return (
        <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none", position: "absolute", top: 0, left: 0 }}
        ></iframe>
    );
}
