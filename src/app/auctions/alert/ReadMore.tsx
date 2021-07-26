import React, {useState} from "react";

interface ReadMoreProps {
  text: String;
  maxCharacterCount: Number;
}

function ReadMore(props: ReadMoreProps){
  let maxCharacterCount = 500;
  
  let showReadMoreButton = props.text.length>500? true:false;

  const [isTruncated, setIsTruncated] = useState(true);
  
  const resultString = isTruncated ? props.text.slice(0, maxCharacterCount) : props.text;
  
  function toggleIsTruncated() {
    setIsTruncated(!isTruncated);
  }
  
  return (
    <p>
      {resultString}
      {showReadMoreButton ? (
        <button className="read-more-button" onClick={toggleIsTruncated}>
        {isTruncated ? "Read More" : "Read Less"}
      </button>
      ) : "" }
    </p>
  )
}

export default ReadMore;
