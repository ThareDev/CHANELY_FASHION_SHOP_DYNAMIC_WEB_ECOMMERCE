import Hero from '@/app/components/Hero'
import Navbar from '@/app/components/Navbar'
import CategoryCards from './components/Categorycards'
  



export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <CategoryCards/>

    </main>
  )
}