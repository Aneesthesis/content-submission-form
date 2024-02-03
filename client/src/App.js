import Header from "./Components/Header";
import PreviewSubmissions from "./Components/PreviewSubmissions";
import SubmissionForm from "./Components/SubmissionForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App  ">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<SubmissionForm />}></Route>
          <Route path="/submissions" element={<PreviewSubmissions />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
