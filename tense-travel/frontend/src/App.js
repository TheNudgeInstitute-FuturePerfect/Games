import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./features/word-game/Home";
import ChooseEra from "./features/word-game/components/ChooseEra";
import ChooseStage from "./features/word-game/components/ChooseStage";
import Question from "./features/word-game/components/Question";
import { StageCompletion } from "./features/word-game";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-era" element={<ChooseEra />} />
        <Route path="/choose-stage/:eraId" element={<ChooseStage />} />
        <Route path="/question/:eraId/:stageId" element={<Question />} />
        <Route path="/complete-stage" element={<StageCompletion />} />
      </Routes>
    </div>
  );
}

export default App;
