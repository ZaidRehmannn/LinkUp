import Hero from "@/components/home/Hero"
import CTAButtons from "@/components/home/CTAButtons"
import Features from "@/components/home/Features"

const page = () => {
    return (
        <main className='flex px-20 py-36 justify-between'>
            {/* left - intro and buttons section */}
            <div>
                <Hero />
                <CTAButtons />
            </div>

            {/* right - features section */}
            <div>
                <Features />
            </div>
        </main>
    )
}

export default page
