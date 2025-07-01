import { LandingPage } from "./pages";

function App() {
  const handleConnect = () => {
    console.log("Connect button clicked!");
  };

  return (
    <>
      <LandingPage onConnect={handleConnect} />
    </>
  );
}

export default App;
