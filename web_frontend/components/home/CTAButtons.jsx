import Link from 'next/link'
import { Button } from "@/components/ui/button"

const CTAButtons = () => {
    return (
        <section className="flex gap-4">
            <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-xl cursor-pointer">
                    Get Started
                </Button>
            </Link>
            <Link href="/login">
                <Button variant="outline" className="text-green-700 border-green-600 hover:bg-green-100 px-7 py-4 rounded-xl cursor-pointer">
                    Login
                </Button>
            </Link>
        </section>
    )
}

export default CTAButtons
