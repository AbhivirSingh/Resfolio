
import Link from "next/link";
import { Edit } from "lucide-react";

interface EditButtonProps {
    portfolioId: string;
}

export const EditButton = ({ portfolioId }: EditButtonProps) => {
    return (
        <Link
            href={`/admin/edit/${portfolioId}`}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
        >
            <Edit size={20} />
            Edit Portfolio
        </Link>
    );
};
