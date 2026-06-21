import { Nav } from "./components/Nav";
import { Header } from "./components/Header";
import { Playground } from "./components/Playground";
import { Docs } from "./components/Docs";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Header />

      <main className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <Playground />
        <Docs />
      </main>

      <Footer />
    </div>
  );
}
