import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import SearchBar from "../components/SearchBar"

interface Props {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="mx-auto">
                <SearchBar />
            </div>
            <div className="mx-10 py-10 flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default layout