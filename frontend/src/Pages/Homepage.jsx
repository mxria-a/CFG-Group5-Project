import { useState } from "react";
import GetItem from "../Components/FoodItemInput";
import PostCodeInput from "../Components/PostCodeInput";
import SubmitButton from "../Components/SubmitButton";

function Home() {
  const [item, setItem] = useState(null);
  const [postcode, setPostcode] = useState(null);
  const [text, setText] = useState(null);
  const [results, setResults] = useState(null);

  function Search() {
    let message = `You've chosen ${item} and your postcode is ${postcode}`;
    setText(message);
  }

  return (
    <>
      <h1>What are you hungry for today?</h1>
      <GetItem setItem={setItem} />
      <PostCodeInput setPostcode={setPostcode} />
      <SubmitButton onClick={Search} />
      <p>{text}</p>
      <div>{results}</div>
    </>
  );
}

export default Home;
