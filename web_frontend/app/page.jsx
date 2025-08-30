import Hero from "@/components/home/Hero"
import CTAButtons from "@/components/home/CTAButtons"
import Features from "@/components/home/Features"

const page = () => {
    return (
        <>
            {/* Desktop View */}
            <main className='hidden lg:flex xl:px-20 px-14 py-56 justify-between'>
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

            {/* Mobile and Tablet View */}
            <main className="lg:hidden flex flex-col p-10 items-center justify-center">
                <Hero />
                <Features />
                <CTAButtons />
            </main>
        </>
    )
}

export default page
