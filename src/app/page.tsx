import ScrollNavbar from "@/components/ScrollNavbar";

export default function Home() {
  return (
    <main>
      <ScrollNavbar />
      <section className="hero">
        <h1>Vilém Barnet</h1>
      </section>
      <section className="about">
        <h1>About</h1>
      </section>
    </main>
  );
}
