import { notFound } from 'next/navigation';
import axios from 'axios';

export default async function SuratView({ params }: { params: { id: string } }) {
    try {
        // This runs on the server
        const response = await axios.get(
            `${process.env.BACKEND_API_URL}/api/letters/${params.id}/print`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SECRET_TOKEN}`
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