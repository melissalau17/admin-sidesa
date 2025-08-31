    "use client";

    import { useEffect, useState } from 'react';
    import { notFound } from 'next/navigation';
    import axios from 'axios';

    export default function SuratView({ params }: { params: { id: string } }) {
        const { id } = params;
        const [pdfUrl, setPdfUrl] = useState<string | null>(null);

        useEffect(() => {
            const fetchPdf = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        console.error("Authorization token not found.");
                        notFound();
                        return;
                    }

                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}/print`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            responseType: 'blob' // Gunakan blob, bukan arraybuffer
                        }
                    );

                    const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                    setPdfUrl(fileURL);
                } catch (error) {
                    console.error("Failed to fetch PDF:", error);
                    notFound();
                }
            };

            fetchPdf();
        }, [id]);

        if (!pdfUrl) {
            return <div className="flex items-center justify-center h-screen">Memuat PDF...</div>;
        }

        return (
            <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
            ></iframe>
        );
    }
    
