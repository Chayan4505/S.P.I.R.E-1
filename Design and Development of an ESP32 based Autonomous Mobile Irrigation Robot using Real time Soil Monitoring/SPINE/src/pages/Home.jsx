import Faq from "@/components/Faq"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero/>
            <Features/>
            <Faq/>
            <Footer/>
        </>
    )
}