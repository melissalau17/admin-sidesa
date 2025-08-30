import { notFound } from 'next/navigation';
import axios from 'axios';

type PageParams = Promise<{ id: string }>;

export default async function SuratView({ params }: { params: PageParams }) {
    try {
        const { id } = await params; // Await the params to get the id
        const token = localStorage.getItem("token");
        // This runs on the server
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}/print`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'arraybuffer'
            }
        );

        // Convert the binary PDF data to a base64 string
        const base64Data = Buffer.from(response.data).toString('base64');
        const dataUrl = `data:application/pdf;base64,${base64Data}`;

        return (
            <iframe
                src={dataUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
            ></iframe>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}