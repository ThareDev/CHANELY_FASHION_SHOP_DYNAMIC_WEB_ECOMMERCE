import Hero from '@/app/components/Hero'
import Navbar from '@/app/components/Navbar'
import CategoryCards from '@/app/components/Categorycards'
import NewArrivals from "@/app/components/NewArrivals";
import AboutContactFooter from "@/app/components/Aboutcontactfooter";
  



export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <CategoryCards/>
      <NewArrivals />
      <AboutContactFooter />

    </main>
  )
}