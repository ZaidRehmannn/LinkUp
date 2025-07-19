import { Users, MessageCircle, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="w-[160px] hover:bg-gray-100">
                <CardContent className="flex flex-col items-center p-4">
                    <Edit3 className="text-green-600 mb-2" size={28} />
                    <p className="text-sm font-semibold text-gray-700">Create Posts</p>
                </CardContent>
            </Card>
            <Card className="w-[160px] hover:bg-gray-100">
                <CardContent className="flex flex-col items-center p-4">
                    <Users className="text-green-600 mb-2" size={28} />
                    <p className="text-sm font-semibold text-gray-700">Make Connections</p>
                </CardContent>
            </Card>
            <Card className="w-[160px] hover:bg-gray-100">
                <CardContent className="flex flex-col items-center p-4">
                    <MessageCircle className="text-green-600 mb-2" size={28} />
                    <p className="text-sm font-semibold text-gray-700">Real-time Chats</p>
                </CardContent>
            </Card>
        </section>
    )
}

export default Features
